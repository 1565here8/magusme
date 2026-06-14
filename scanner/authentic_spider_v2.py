import scrapy
import json
import re
from datetime import datetime

class AuthenticSpellSpider(scrapy.Spider):
    name = 'authentic_spells_v2'
    
    custom_settings = {
        'DOWNLOAD_DELAY': 2,
        'RANDOMIZE_DOWNLOAD_DELAY': True,
        'USER_AGENT': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'ROBOTSTXT_OBEY': False,
        'FEEDS': {
            '/Users/mymac/Desktop/magusme-main/scanner/output/authentic_spells_extracted.json': {
                'format': 'json',
                'overwrite': True
            }
        }
    }
    
    def start_requests(self):
        with open('/Users/mymac/Desktop/magusme-main/scanner/research/targets.json') as f:
            targets = json.load(f)
        
        for source_name, urls in targets.items():
            for url in urls:
                yield scrapy.Request(
                    url=url,
                    callback=self.parse_book_page,
                    meta={'source': source_name}
                )
    
    def parse_book_page(self, response):
        source = response.meta['source']
        
        # Try multiple selectors for content
        content = None
        
        # Project Gutenberg HTML
        if 'gutenberg.org' in response.url:
            content = response.css('#pgtext *::text').getall()
            if not content:
                content = response.css('.chapter *::text').getall()
            if not content:
                content = response.css('pre *::text').getall()
        
        # Internet Archive
        if 'archive.org' in response.url:
            content = response.css('#page-content *::text').getall()
            if not content:
                content = response.css('.item-description *::text').getall()
            if not content:
                content = response.css('text *::text').getall()
        
        if not content:
            content = response.css('::text').getall()
        
        full_text = ' '.join(content).strip() if content else ''
        
        # Only keep if substantial
        if len(full_text) < 500:
            return
        
        # Extract potential spells using patterns
        spells = self.extract_spells(full_text, source, response.url)
        
        for spell in spells:
            yield spell
    
    def extract_spells(self, text, source, url):
        spells = []
        
        # Split by common spell delimiters
        patterns = [
            r'(?i)(spell|ritual|incantation|invocation|conjuration|evocation)\s+(?:of|for|to)\s+([^.!?]{10,100})',
            r'(?i)(the\s+)(?:spell|ritual|ceremony)\s+(?:of|for|to)\s+([^.!?]{10,100})',
            r'(?i)(\d+\.\s*)(?:spell|ritual|incantation)\s+([^.!?]{10,200})',
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, text)
            for match in matches:
                if isinstance(match, tuple):
                    spell_name = ' '.join(match).strip()
                else:
                    spell_name = match.strip()
                
                if len(spell_name) > 20:
                    spells.append({
                        'source': source,
                        'source_url': url,
                        'title': spell_name[:200],
                        'extracted_text': text[:3000],
                        'timestamp': datetime.now().isoformat()
                    })
        
        # If no patterns matched, use chapters/sections
        if not spells:
            sections = re.split(r'\n\s*\n|\r\n\s*\r\n', text)
            for section in sections:
                if len(section) > 500 and any(kw in section.lower() for kw in ['spell', 'ritual', 'magic', 'incantation', 'conjuration', 'evocation', 'invocation', 'prayer', 'blessing', 'curse', 'hex']):
                    spells.append({
                        'source': source,
                        'source_url': url,
                        'title': section[:150].strip(),
                        'extracted_text': section[:3000],
                        'timestamp': datetime.now().isoformat()
                    })
                    break
        
        return spells[:5]  # Limit per book

if __name__ == '__main__':
    from scrapy.crawler import CrawlerProcess
    process = CrawlerProcess()
    process.crawl(AuthenticSpellSpider)
    process.start()
