import json

TARGETS = {
    "yale_digital": [
        "https://digital.library.yale.edu/collections/beinecke-rare-book-and-manuscript-collections",
        "https://digital.library.yale.edu/collections/beinecke-rare-book-and-manuscript-collections/search?q=grimoire"
    ],
    "internet_archive": [
        "https://archive.org/details/grimoires",
        "https://archive.org/details/the-lesser-key-of-solomon"
    ],
    "project_gutenberg": [
        "https://www.gutenberg.org/ebooks/search/?query=occult"
    ]
}

with open('/Users/mymac/Desktop/magusme-main/scanner/research/targets.json', 'w') as f:
    json.dump(TARGETS, f, indent=2)
print("Targets saved.")
