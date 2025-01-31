import os
import re
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import random
import math

def clean_filename(filename):
    """Nettoie et normalise le nom de fichier"""
    # Convertir en minuscules
    filename = filename.lower()
    
    # Supprimer les caractères non alphanumériques sauf '_' et '.'
    filename = re.sub(r'[^a-z0-9_\.]', '_', filename)
    
    # Limiter la longueur
    filename = filename[:50]
    
    # Assurer une extension .jpg
    if not filename.endswith('.jpg'):
        filename = filename.rsplit('.', 1)[0] + '.jpg'
    
    return filename

def create_clothing_mockup(width, height, collection, product_type, index):
    """Crée un mockup de vêtement réaliste"""
    # Créer une image de base blanche
    image = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(image)

    # Palette de couleurs durables
    sustainable_colors = [
        (110, 139, 116),   # Vert sauge
        (85, 107, 47),     # Vert olive
        (210, 180, 140),   # Beige
        (188, 143, 143),   # Rose poudré
        (139, 69, 19),     # Marron
        (46, 139, 87),     # Vert mer
    ]

    # Choisir une couleur de base
    base_color = random.choice(sustainable_colors)

    # Dessiner le contour du vêtement selon le type
    if product_type in ['robe', 'robe soirée', 'robe imprimée']:
        # Silhouette de robe
        points = [
            (width*0.2, height*0.3),   # Épaule gauche
            (width*0.8, height*0.3),   # Épaule droite
            (width*0.9, height*0.7),   # Bas droit
            (width*0.1, height*0.7)    # Bas gauche
        ]
        draw.polygon(points, fill=base_color + (200,))
        
    elif product_type in ['chemise', 'top', 'blazer', 'cardigan']:
        # Silhouette de chemise ou top
        points = [
            (width*0.2, height*0.2),   # Épaule gauche
            (width*0.8, height*0.2),   # Épaule droite
            (width*0.9, height*0.6),   # Bas droit
            (width*0.1, height*0.6)    # Bas gauche
        ]
        draw.polygon(points, fill=base_color + (200,))
        
    elif product_type in ['pantalon', 'short', 'pantalon large']:
        # Silhouette de pantalon
        points = [
            (width*0.3, height*0.4),   # Taille gauche
            (width*0.7, height*0.4),   # Taille droite
            (width*0.8, height*0.9),   # Bas droit
            (width*0.2, height*0.9)    # Bas gauche
        ]
        draw.polygon(points, fill=base_color + (200,))
    
    elif product_type in ['jupe', 'salopette', 'ensemble tailleur']:
        # Silhouette de jupe
        points = [
            (width*0.3, height*0.4),   # Taille gauche
            (width*0.7, height*0.4),   # Taille droite
            (width*0.8, height*0.8),   # Bas droit
            (width*0.2, height*0.8)    # Bas gauche
        ]
        draw.polygon(points, fill=base_color + (200,))
    
    else:
        # Forme générique
        points = [
            (width*0.2, height*0.3),
            (width*0.8, height*0.3),
            (width*0.9, height*0.7),
            (width*0.1, height*0.7)
        ]
        draw.polygon(points, fill=base_color + (200,))

    # Ajouter des détails
    # Plis et textures
    for _ in range(10):
        x1 = random.randint(0, width)
        x2 = x1 + random.randint(10, 50)
        y = random.randint(int(height*0.3), int(height*0.8))
        draw.line([x1, y, x2, y], fill=base_color + (100,), width=2)

    # Ajouter un texte subtil
    try:
        font = ImageFont.truetype("arial.ttf", 20)
    except IOError:
        font = ImageFont.load_default()
    
    draw.text(
        (width*0.05, height*0.05), 
        f"Éco Mode: {product_type.capitalize()}", 
        font=font, 
        fill=(100, 100, 100)
    )

    # Ajouter un effet d'ombre
    image = image.filter(ImageFilter.GaussianBlur(1))

    return image

def main():
    # Configuration des collections et types de produits
    collections = {
        'printemps': [
            'robe', 'chemise', 'pantalon', 'blazer', 'top', 
            'jupe', 'cardigan', 'salopette', 'short', 'robe imprimée'
        ],
        'edition_limitee': [
            'robe soirée', 'blazer', 'ensemble tailleur', 'manteau', 
            'top', 'jupe', 'combinaison', 'pantalon large'
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
                # Taille de l'image
                width, height = 800, 1200
                
                # Générer l'image
                image = create_clothing_mockup(width, height, collection, product_type, i)
                
                # Générer le nom de fichier
                filename = clean_filename(f"{collection}_{product_type}_{i}.jpg")
                filepath = os.path.join(collection_dir, filename)
                
                # Sauvegarder l'image
                image.save(filepath, quality=90)
                print(f"Image générée : {filepath}")

if __name__ == '__main__':
    main()
