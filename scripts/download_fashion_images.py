import os
import requests
from dotenv import load_dotenv
import json

# Charger les variables d'environnement
load_dotenv()

def download_unsplash_images(collection_name, product_types, num_images=3):
    """
    Télécharge des images de mode éco-responsable depuis Unsplash
    
    :param collection_name: Nom de la collection (printemps, edition_limitee, accessoires)
    :param product_types: Liste des types de produits à rechercher
    :param num_images: Nombre d'images à télécharger par type de produit
    """
    # Récupérer la clé API depuis les variables d'environnement
    access_key = os.getenv('REACT_APP_UNSPLASH_ACCESS_KEY')
    if not access_key:
        raise ValueError("La clé API Unsplash n'est pas définie. Veuillez la configurer dans le fichier .env")

    # Répertoire de destination
    base_dir = 'c:/Users/bstit/CascadeProjects/eco-fashion-store/public/images/products'
    collection_dir = os.path.join(base_dir, collection_name)
    os.makedirs(collection_dir, exist_ok=True)

    # Configuration de la requête
    base_url = "https://api.unsplash.com/search/photos"
    headers = {
        "Authorization": f"Client-ID {access_key}"
    }

    # Télécharger des images pour chaque type de produit
    for product_type in product_types:
        # Requête de recherche
        params = {
            "query": f"sustainable fashion {product_type}",
            "per_page": num_images,
            "orientation": "portrait"
        }

        try:
            response = requests.get(base_url, headers=headers, params=params)
            response.raise_for_status()  # Lève une exception pour les codes d'erreur HTTP
            
            results = response.json()['results']
            
            for i, photo in enumerate(results, 1):
                # Télécharger l'image
                image_url = photo['urls']['regular']
                image_response = requests.get(image_url)
                
                # Générer le nom de fichier
                filename = f"{collection_name}_{product_type.replace(' ', '_')}_{i}.jpg"
                filepath = os.path.join(collection_dir, filename)
                
                # Sauvegarder l'image
                with open(filepath, 'wb') as f:
                    f.write(image_response.content)
                
                print(f"Image téléchargée : {filepath}")

        except requests.exceptions.RequestException as e:
            print(f"Erreur lors du téléchargement des images pour {product_type}: {e}")

def main():
    # Configuration pour la collection d'accessoires
    accessoires_types = [
        'eco tote bag', 
        'silk scarf', 
        'vegan leather belt', 
        'ethical clutch', 
        'straw sun hat', 
        'recycled jewelry', 
        'sustainable sunglasses', 
        'organic cotton scarf', 
        'fair trade bracelet', 
        'eco urban backpack'
    ]
    
    download_unsplash_images('accessoires', accessoires_types, num_images=3)

if __name__ == '__main__':
    main()
