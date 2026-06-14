import scrapy
import json
import re
from datetime import datetime

class AuthenticSpellSpider(scrapy.Spider):
    name = 'authentic_spells_v4'
    
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
    
    # CORRECT Project Gutenberg text file URLs for actual grimoires
    GUTENBERG_TEXTS = [
        ("https://www.gutenberg.org/cache/epub/19007/pg19007.txt", "The Lesser Key of Solomon (Goetia)"),
        ("https://www.gutenberg.org/cache/epub/15966/pg15966.txt", "The Kybalion"),
        ("https://www.gutenberg.org/cache/epub/3382/pg3382.txt", "The Book of Sacred Magic of Abramelin"),
        ("https://www.gutenberg.org/cache/epub/43688/pg43688.txt", "The Goetia"),
        ("https://www.gutenberg.org/cache/epub/3470/pg3470.txt", "The Key of Solomon"),
        ("https://www.gutenberg.org/cache/epub/29232/pg29232.txt", "The Book of Talismans"),
        ("https://www.gutenberg.org/cache/epub/59755/pg59755.txt", "Modern Magic"),
        ("https://www.gutenberg.org/cache/epub/12027/pg12027.txt", "Witch, Warlock, and Magician"),
        ("https://www.gutenberg.org/cache/epub/6666/pg6666.txt", "Hidden Symbolism of Alchemy"),
        ("https://www.gutenberg.org/cache/epub/45285/pg45285.txt", "The Philosophy of Mystery"),
        ("https://www.gutenberg.org/cache/epub/20100/pg20100.txt", "The Initiates of the Flame"),
        ("https://www.gutenberg.org/cache/epub/16054/pg16054.txt", "Iamblichus on Mysteries"),
        ("https://www.gutenberg.org/cache/epub/38394/pg38394.txt", "Cosmic Symbolism"),
    ]
    
    def start_requests(self):
        for url, book_title in self.GUTENBERG_TEXTS:
            yield scrapy.Request(
                url=url,
                callback=self.parse_text_file,
                meta={'source': 'project_gutenberg', 'book_title': book_title}
            )
    
    def parse_text_file(self, response):
        full_text = response.text
        book_title = response.meta['book_title']
        
        if len(full_text) < 1000:
            return
        
        # Strip PG header/footer
        content_start = full_text.find('*** START OF')
        if content_start > 0:
            full_text = full_text[content_start:]
        
        content_end = full_text.find('*** END OF')
        if content_end > 0:
            full_text = full_text[:content_end]
        
        # Extract spells/rituals
        spells = self.extract_spells(full_text, book_title, response.url)
        
        for spell in spells:
            yield spell
    
    def extract_spells(self, text, book_title, url):
        spells = []
        
        # Split by major sections
        sections = re.split(r'\n\s*(?:CHAPTER|Chapter|Spell|SPELL|Ritual|RITUAL|Ceremony|CEREMONY|Invocation|INVOCATION|Conjuration|CONJURATION|Evocation|EVOCATION)\s+[\w\d]+\s*\n', text)
        
        spell_keywords = ['spell', 'ritual', 'incantation', 'conjuration', 'evocation', 
                        'invocation', 'magic circle', 'pentagram', 'pentacle', 'talisman', 'amulet',
                        'exorcism', 'banishing', 'protection', 'summoning', 'binding',
                        'curse', 'hex', 'blessing', 'prayer', 'enchantment', 'sigil',
                        'seal', 'spirit', 'demon', 'angel', 'archangel', 'planetary',
                        'hermetic', 'kabbalah', 'qabalah', 'goetia', 'theurgia', 'necromancy']
        
        for section in sections:
            if len(section) < 500:
                continue
            
            section_lower = section.lower()
            keyword_count = sum(1 for kw in spell_keywords if kw in section_lower)
            
            if keyword_count >= 2:
                # Extract title
                title_match = re.search(r'^([^\n]{10,200})', section.strip())
                title = title_match.group(1).strip() if title_match else f"Ritual from {book_title}"
                
                spells.append({
                    'source': 'project_gutenberg',
                    'source_book': book_title,
                    'source_url': url,
                    'title': title[:200],
                    'content': section.strip()[:5000],
                    'timestamp': datetime.now().isoformat()
                })
        
        return spells[:15]

if __name__ == '__main__':
    from scrapy.crawler import CrawlerProcess
    process = CrawlerProcess()
    process.crawl(AuthenticSpellSpider)
    process.start()
