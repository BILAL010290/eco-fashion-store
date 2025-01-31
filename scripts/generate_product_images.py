from PIL import Image, ImageDraw, ImageFont
import os
import random
import re

def generate_color_palette():
    """Génère une palette de couleurs durables et élégantes"""
    return [
        # Tons de vert
        (110, 139, 116),   # Vert sauge
        (85, 107, 47),     # Vert olive
        (46, 139, 87),     # Vert mer

        # Tons de beige et neutre
        (210, 180, 140),   # Tan
        (188, 143, 143),   # Rose poudré
        (205, 192, 176),   # Beige gris

        # Tons dorés
        (212, 175, 55),    # Or
        (218, 165, 32),    # Or doré
        (184, 134, 11),    # Or foncé

        # Tons de bleu
        (70, 130, 180),    # Bleu acier
        (100, 149, 237),   # Bleu cornflower
    ]

def generate_product_image(collection, product_type, index):
    """Génère une image de produit synthétique"""
    # Taille de l'image
    width, height = 800, 1200
    
    # Créer une nouvelle image avec un fond coloré
    background_color = random.choice(generate_color_palette())
    image = Image.new('RGB', (width, height), color=background_color)
    draw = ImageDraw.Draw(image)
    
    # Charger une police
    try:
        font = ImageFont.truetype("arial.ttf", 40)
    except IOError:
        font = ImageFont.load_default()
    
    # Ajouter le texte
    text = f"{collection.capitalize()}\n{product_type.capitalize()}"
    text_color = (255, 255, 255)  # Blanc
    text_position = (width//2, height//2)
    draw.text(text_position, text, fill=text_color, font=font, anchor="mm", align="center")
    
    # Ajouter des formes géométriques décoratives
    for _ in range(10):
        shape_color = random.choice(generate_color_palette())
        x = random.randint(0, width)
        y = random.randint(0, height)
        size = random.randint(50, 200)
        
        # Choix aléatoire entre rectangle et ellipse
        if random.choice([True, False]):
            draw.rectangle([x, y, x+size, y+size], fill=shape_color, outline=None)
        else:
            draw.ellipse([x, y, x+size, y+size], fill=shape_color, outline=None)
    
    return image

def generate_filename(collection, product_type, index):
    """Génère un nom de fichier cohérent et standardisé"""
    # Normaliser le nom de la collection
    collection_normalized = collection.lower().replace(' ', '_')
    
    # Normaliser le type de produit
    product_type_normalized = re.sub(r'[^a-z0-9]+', '_', product_type.lower()).strip('_')
    
    # Construire le nom de fichier
    filename = f"{collection_normalized}_{product_type_normalized}_{index}.jpg"
    
    return filename.replace('__', '_')  # Enlever les doubles underscores

def save_image(image, filepath):
    """Sauvegarder l'image avec un nom de fichier propre"""
    # Supprimer les extensions doubles ou incorrectes
    filepath = re.sub(r'\.jpg\.jpg$', '.jpg', filepath)
    filepath = re.sub(r'\.jpgpg$', '.jpg', filepath)
    
    image.save(filepath, quality=90)
    print(f"Image générée : {filepath}")

def main():
    # Configuration des collections et types de produits
    collections = {
        'printemps': [
            'robe', 'chemise', 'pantalon', 'blazer', 'top', 
            'jupe', 'cardigan', 'salopette', 'short', 'robe imprimée'
        ],
        'edition_limitee': [
            'veste', 'pantalon', 'robe', 'blazer', 'tailleur', 
            'manteau', 'top', 'jupe', 'combinaison', 'pantalon large'
        ],
        'accessoires': [
            'sac', 'écharpe', 'ceinture', 'pochette', 'chapeau', 
            'bijoux', 'lunettes', 'foulard', 'bracelet', 'sac dos'
        ]
    }

    # Répertoire de destination
    base_dir = 'c:/Users/bstit/CascadeProjects/eco-fashion-store/public/images/products'
    os.makedirs(base_dir, exist_ok=True)

    # Générer des images pour chaque collection et type de produit
    for collection, product_types in collections.items():
        collection_dir = os.path.join(base_dir, collection)
        os.makedirs(collection_dir, exist_ok=True)
        
        for product_type in product_types:
            for i in range(1, 4):  # Générer 3 images par type de produit
                filename = generate_filename(collection, product_type, i)
                filepath = os.path.join(collection_dir, filename)
                
                image = generate_product_image(collection, product_type, i)
                save_image(image, filepath)

if __name__ == '__main__':
    main()
