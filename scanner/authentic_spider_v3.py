import scrapy
import json
import re
from datetime import datetime

class AuthenticSpellSpider(scrapy.Spider):
    name = 'authentic_spells_v3'
    
    custom_settings = {
        'DOWNLOAD_DELAY': 1,
        'RANDOMIZE_DOWNLOAD_DELAY': True,
        'USER_AGENT': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'ROBOTSTXT_OBEY': False,
        'FEEDS': {
            '/Users/mymac/Desktop/magusme-main/scanner/output/authentic_spells_raw.json': {
                'format': 'json',
                'overwrite': True
            }
        }
    }
    
    # Direct links to Project Gutenberg text files
    GUTENBERG_TEXTS = [
        "https://www.gutenberg.org/cache/epub/19007/pg19007.txt",  # Lesser Key of Solomon
        "https://www.gutenberg.org/cache/epub/15966/pg15966.txt",  # Kybalion
        "https://www.gutenberg.org/cache/epub/3382/pg3382.txt",    # Book of Sacred Magic
        "https://www.gutenberg.org/cache/epub/43688/pg43688.txt",  # Goetia
        "https://www.gutenberg.org/cache/epub/39150/pg39150.txt",  # Complete Herbal
        "https://www.gutenberg.org/cache/epub/6666/pg6666.txt",    # Hidden Symbolism
        "https://www.gutenberg.org/cache/epub/59755/pg59755.txt",  # Modern Magic
        "https://www.gutenberg.org/cache/epub/12027/pg12027.txt",  # Witch, Warlock, Magician
        "https://www.gutenberg.org/cache/epub/26402/pg26402.txt",  # Mysteries of All Nations
        "https://www.gutenberg.org/cache/epub/38394/pg38394.txt",  # Cosmic Symbolism
        "https://www.gutenberg.org/cache/epub/20100/pg20100.txt",  # Initiates of the Flame
        "https://www.gutenberg.org/cache/epub/16054/pg16054.txt",  # Iamblichus Mysteries
        "https://www.gutenberg.org/cache/epub/45285/pg45285.txt",  # Philosophy of Mystery
        "https://www.gutenberg.org/cache/epub/29232/pg29232.txt",  # Book of Talismans
        "https://www.gutenberg.org/cache/epub/3470/pg3470.txt",    # Key of Solomon
        "https://www.gutenberg.org/cache/epub/11089/pg11089.txt",  # Secret Teachings of All Ages
    ]
    
    def start_requests(self):
        for url in self.GUTENBERG_TEXTS:
            yield scrapy.Request(
                url=url,
                callback=self.parse_text_file,
                meta={'source': 'project_gutenberg'}
            )
    
    def parse_text_file(self, response):
        # Direct text file - just get the body
        full_text = response.text
        
        if len(full_text) < 1000:
            return
        
        # Extract book title from header
        title_match = re.search(r'Title:\s*([^\n]+)', full_text)
        book_title = title_match.group(1).strip() if title_match else 'Unknown'
        
        # Split into sections (chapters, spells, etc.)
        spells = self.extract_spells_from_text(full_text, book_title, response.url)
        
        for spell in spells:
            yield spell
    
    def extract_spells_from_text(self, text, book_title, url):
        spells = []
        
        # Clean up Project Gutenberg header/footer
        # Find actual content start
        content_start = text.find('*** START OF')
        if content_start > 0:
            text = text[content_start:]
        
        content_end = text.find('*** END OF')
        if content_end > 0:
            text = text[:content_end]
        
        # Split into sections by chapter/section markers
        sections = re.split(r'\n\s*(?:CHAPTER|Chapter|Section|SECTION|Spell|SPELL|Ritual|RITUAL)\s+[\w\d]+\s*\n', text)
        
        for i, section in enumerate(sections):
            if len(section) < 500:
                continue
            
            # Check for spell-related content
            section_lower = section.lower()
            spell_keywords = ['spell', 'ritual', 'incantation', 'conjuration', 'evocation', 
                            'invocation', 'magic circle', 'pentagram', 'talisman', 'amulet',
                            'exorcism', 'banishing', 'protection', 'summoning', 'binding',
                            'curse', 'hex', 'blessing', 'prayer', 'invocation', 'enchantment']
            
            keyword_count = sum(1 for kw in spell_keywords if kw in section_lower)
            
            if keyword_count >= 2:
                # This looks like a spell/ritual section
                title_match = re.search(r'^([^\n]{10,150})', section.strip())
                title = title_match.group(1).strip() if title_match else f"Spell from {book_title}"
                
                spells.append({
                    'source': 'project_gutenberg',
                    'source_book': book_title,
                    'source_url': url,
                    'title': title[:200],
                    'content': section[:5000],
                    'timestamp': datetime.now().isoformat()
                })
        
        # If no sections found, try splitting by double newlines
        if not spells:
            paragraphs = re.split(r'\n\s*\n', text)
            for para in paragraphs:
                if len(para) > 1000:
                    para_lower = para.lower()
                    if sum(1 for kw in spell_keywords if kw in para_lower) >= 3:
                        title_match = re.search(r'^([^\n]{10,150})', para.strip())
                        title = title_match.group(1).strip() if title_match else f"Spell from {book_title}"
                        spells.append({
                            'source': 'project_gutenberg',
                            'source_book': book_title,
                            'source_url': url,
                            'title': title[:200],
                            'content': para[:5000],
                            'timestamp': datetime.now().isoformat()
                        })
                        break
        
        return spells[:10]  # Limit per book

if __name__ == '__main__':
    from scrapy.crawler import CrawlerProcess
    process = CrawlerProcess()
    process.crawl(AuthenticSpellSpider)
    process.start()
