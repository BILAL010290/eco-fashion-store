import webbrowser
import pyperclip
import os
from dotenv import load_dotenv, set_key

def open_unsplash_registration():
    """Ouvre la page d'inscription Unsplash"""
    print("🌐 Ouverture de la page d'inscription Unsplash...")
    webbrowser.open('https://unsplash.com/join')

def open_unsplash_applications():
    """Ouvre la page des applications Unsplash"""
    print("🌐 Ouverture de la page des applications Unsplash...")
    webbrowser.open('https://unsplash.com/oauth/applications')

def save_unsplash_key():
    """Guide l'utilisateur pour sauvegarder la clé API"""
    print("\n🔑 Assistant de configuration de la clé API Unsplash\n")
    
    print("Étapes à suivre :")
    print("1. Connectez-vous à votre compte Unsplash")
    print("2. Créez une nouvelle application")
    print("3. Copiez votre Access Key")
    
    input("\n[Appuyez sur Entrée une fois que vous avez copié votre clé]")
    
    # Récupérer la clé depuis le presse-papiers
    unsplash_key = pyperclip.paste()
    
    # Vérifier la validité de la clé (format approximatif)
    if len(unsplash_key) > 20 and all(c.isalnum() for c in unsplash_key):
        # Chemin du fichier .env
        env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
        
        # Sauvegarder la clé dans le fichier .env
        set_key(env_path, 'REACT_APP_UNSPLASH_ACCESS_KEY', unsplash_key)
        
        print(f"\n✅ Clé Unsplash sauvegardée avec succès !")
        print(f"Clé : {unsplash_key[:10]}...{unsplash_key[-5:]}")
    else:
        print("❌ La clé semble invalide. Veuillez réessayer.")

def main():
    print("🚀 Assistant de configuration Unsplash API\n")
    
    print("1. Je vais d'abord ouvrir la page d'inscription Unsplash")
    open_unsplash_registration()
    
    input("\n[Créez un compte si nécessaire, puis appuyez sur Entrée]")
    
    print("\n2. Maintenant, je vais ouvrir la page des applications")
    open_unsplash_applications()
    
    input("\n[Créez une nouvelle application, puis appuyez sur Entrée]")
    
    print("\n3. Copiez votre Access Key et revenez ici")
    save_unsplash_key()

if __name__ == '__main__':
    main()
