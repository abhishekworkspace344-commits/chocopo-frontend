import os
import re

pages_dir = r'd:\aktechnologies\WORKPLACE\chocopo\frontend\src\pages'
for filename in os.listdir(pages_dir):
    if not filename.endswith('.js'): continue
    if filename.startswith('Admin'): continue
    
    filepath = os.path.join(pages_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if '<nav ' not in content:
        continue
        
    new_content = re.sub(r'<nav\s+className=\"navbar.*?</nav>', '<Navbar />', content, flags=re.DOTALL)
    
    if new_content != content:
        if 'import Navbar' not in new_content:
            new_content = new_content.replace('import React', 'import Navbar from "../components/Navbar";\nimport React', 1)
            # Some files might have import axios, React... so fallback:
            if 'import Navbar' not in new_content:
                new_content = 'import Navbar from "../components/Navbar";\n' + new_content
                
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Updated {filename}')
