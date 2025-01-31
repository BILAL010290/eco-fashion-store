from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import os
import random
import colorsys

def generate_sustainable_color_palette():
    """Génère une palette de couleurs durables et élégantes"""
    colors = [
        # Verts naturels
        (110, 139, 116),   # Vert sauge
        (85, 107, 47),     # Vert olive
        (46, 139, 87),     # Vert mer

        # Tons neutres
        (210, 180, 140),   # Beige
        (188, 143, 143),   # Rose poudré
        (205, 192, 176),   # Gris beige

        # Tons terreux
        (139, 69, 19),     # Marron
        (160, 82, 45),     # Terre de Sienne
        (128, 64, 0),      # Brun foncé
    ]
    return colors

def create_gradient_background(width, height):
    """Crée un fond dégradé élégant"""
    base_color = random.choice(generate_sustainable_color_palette())
    
    # Convertir RGB en HSV pour un dégradé plus naturel
    h, s, v = colorsys.rgb_to_hsv(base_color[0]/255, base_color[1]/255, base_color[2]/255)
    
    # Créer un dégradé
    image = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(image)
    
    for y in range(height):
        # Variation de luminosité
        brightness = 1 - (y / height) * 0.3
        new_v = max(0, min(1, v * brightness))
        
        # Convertir de nouveau en RGB
        r, g, b = [int(x * 255) for x in colorsys.hsv_to_rgb(h, s, new_v)]
        
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    
    return image

def add_texture(image):
    """Ajoute une texture subtile à l'image"""
    # Créer un filtre de texture
    texture = Image.new('RGB', image.size, (255, 255, 255))
    draw = ImageDraw.Draw(texture)
    
    # Ajouter des lignes subtiles
    for i in range(0, image.size[1], 5):
        shade = random.randint(230, 255)
        draw.line([(0, i), (image.size[0], i)], fill=(shade, shade, shade), width=1)
    
    # Fusionner la texture
    return Image.blend(image, texture, 0.1)

def add_fashion_details(image, product_type):
    """Ajoute des détails de mode stylisés"""
    draw = ImageDraw.Draw(image)
    width, height = image.size
    
    # Charger une police élégante
    try:
        font = ImageFont.truetype("arial.ttf", 40)
    except IOError:
        font = ImageFont.load_default()
    
    # Ajouter des éléments de design
    design_elements = {
        'robe': lambda: draw.polygon(
            [(width*0.3, height*0.7), (width*0.7, height*0.7), 
             (width*0.8, height), (width*0.2, height)], 
            fill=(random.randint(50, 150), random.randint(50, 150), random.randint(50, 150))
        ),
        'chemise': lambda: draw.rectangle(
            [width*0.2, height*0.5, width*0.8, height*0.7], 
            fill=(random.randint(50, 200), random.randint(50, 200), random.randint(50, 200))
        ),
        'pantalon': lambda: draw.polygon(
            [(width*0.3, height*0.6), (width*0.7, height*0.6), 
             (width*0.9, height), (width*0.1, height)], 
            fill=(random.randint(50, 150), random.randint(50, 150), random.randint(50, 150))
        )
    }
    
    # Ajouter un élément de design si disponible
    if product_type in design_elements:
        design_elements[product_type]()
    
    # Ajouter un texte stylisé
    draw.text(
        (width*0.05, height*0.05), 
        f"Éco Mode: {product_type.capitalize()}", 
        font=font, 
        fill=(255, 255, 255)
    )
    
    return image

def generate_fashion_image(collection, product_type, index):
    """Génère une image de mode réaliste et durable"""
    # Taille de l'image
    width, height = 800, 1200
    
    # Créer un fond dégradé
    image = create_gradient_background(width, height)
    
    # Ajouter de la texture
    image = add_texture(image)
    
    # Ajouter des détails de mode
    image = add_fashion_details(image, product_type)
    
    # Améliorer la qualité de l'image
    enhancer = ImageEnhance.Contrast(image)
    image = enhancer.enhance(1.2)
    
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
                filename = f"{collection}_{product_type.replace(' ', '_')}_{i}.jpg"
                filepath = os.path.join(collection_dir, filename)
                
                image = generate_fashion_image(collection, product_type, i)
                image.save(filepath, quality=90)
                print(f"Image générée : {filepath}")

if __name__ == '__main__':
    main()
