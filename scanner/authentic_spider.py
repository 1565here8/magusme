import scrapy
import json
from datetime import datetime

class AuthenticSpellSpider(scrapy.Spider):
    name = 'authentic_spells'
    
    custom_settings = {
        'DOWNLOAD_DELAY': 2,
        'RANDOMIZE_DOWNLOAD_DELAY': True,
        'USER_AGENT': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'ROBOTSTXT_OBEY': False,
    }
    
    def start_requests(self):
        # Load target URLs
        import json
        with open('/Users/mymac/Desktop/magusme-main/scanner/research/targets.json') as f:
            targets = json.load(f)
        
        for source_name, urls in targets.items():
            for url in urls:
                yield scrapy.Request(
                    url=url,
                    callback=self.parse,
                    meta={'source': source_name}
                )
    
    def parse(self, response):
        source = response.meta['source']
        
        # Extract text content from pages
        text_content = response.css('::text').getall()
        full_text = ' '.join(text_content).strip()
        
        # Look for spell-related content
        if any(keyword in full_text.lower() for keyword in ['spell', 'ritual', 'incantation', 'grimoire', 'magic']):
            yield {
                'source': source,
                'url': response.url,
                'content': full_text[:5000],
                'timestamp': datetime.now().isoformat()
            }

# Run spider
if __name__ == '__main__':
    from scrapy.crawler import CrawlerProcess
    process = CrawlerProcess({
        'FEEDS': {
            '/Users/mymac/Desktop/magusme-main/scanner/output/authentic_raw.json': {'format': 'json'}
        }
    })
    process.crawl(AuthenticSpellSpider)
    process.start()
