import type { Product, Category, Shop } from '../types';

// Catégories - JOUR DE MARCHÉ = L'ALIBABA IVOIRIEN ! On vend TOUT ici !
// Du marché traditionnel aux boutiques high-tech, tout le monde est bienvenu !
export const categories: Category[] = [
  // === ALIMENTATION & BOISSONS ===
  { 
    id: '1', name: 'Légumes & Fruits', slug: 'legumes-fruits', icon: '🥦', 
    description: 'Légumes frais, fruits de saison, produits du jardin',
    subcategories: [
      { id: '1-1', name: 'Légumes frais', slug: 'legumes-frais', icon: '🥬' },
      { id: '1-2', name: 'Fruits locaux', slug: 'fruits-locaux', icon: '🥭' },
      { id: '1-3', name: 'Fruits importés', slug: 'fruits-importes', icon: '🍎' },
      { id: '1-4', name: 'Tubercules', slug: 'tubercules', icon: '🥔' },
      { id: '1-5', name: 'Herbes & Aromates', slug: 'herbes-aromates', icon: '🌿' },
    ]
  },
  { 
    id: '2', name: 'Attiéké & Manioc', slug: 'attieke-manioc', icon: '🥣', 
    description: 'Attiéké, placali, foutou, gari...',
    subcategories: [
      { id: '2-1', name: 'Attiéké', slug: 'attieke', icon: '🥣' },
      { id: '2-2', name: 'Placali', slug: 'placali', icon: '🍚' },
      { id: '2-3', name: 'Foutou', slug: 'foutou', icon: '🍛' },
      { id: '2-4', name: 'Gari', slug: 'gari', icon: '🌾' },
      { id: '2-5', name: 'Farine de manioc', slug: 'farine-manioc', icon: '🥡' },
    ]
  },
  { 
    id: '3', name: 'Céréales & Vivriers', slug: 'cereales-vivriers', icon: '🌾', 
    description: 'Riz local, maïs, mil, igname, banane plantain',
    subcategories: [
      { id: '3-1', name: 'Riz', slug: 'riz', icon: '🍚' },
      { id: '3-2', name: 'Maïs', slug: 'mais', icon: '🌽' },
      { id: '3-3', name: 'Mil & Sorgho', slug: 'mil-sorgho', icon: '🌾' },
      { id: '3-4', name: 'Igname', slug: 'igname', icon: '🥔' },
      { id: '3-5', name: 'Banane plantain', slug: 'banane-plantain', icon: '🍌' },
      { id: '3-6', name: 'Haricots & Légumineuses', slug: 'haricots-legumineuses', icon: '🫘' },
    ]
  },
  { 
    id: '4', name: 'Restaurants & Maquis', slug: 'restaurants', icon: '🍽️', 
    description: 'Plats cuisinés, maquis, garba, allocodrome',
    subcategories: [
      { id: '4-1', name: 'Garba', slug: 'garba', icon: '🐟' },
      { id: '4-2', name: 'Allocodrome', slug: 'allocodrome', icon: '🍌' },
      { id: '4-3', name: 'Maquis', slug: 'maquis', icon: '🍖' },
      { id: '4-4', name: 'Grillades', slug: 'grillades', icon: '🍢' },
      { id: '4-5', name: 'Plats traditionnels', slug: 'plats-traditionnels', icon: '🍲' },
      { id: '4-6', name: 'Fast-food', slug: 'fast-food', icon: '🍔' },
    ]
  },
  { 
    id: '5', name: 'Poissons & Viandes', slug: 'poissons-viandes', icon: '🥩', 
    description: 'Poisson frais, viande, poulet, escargots, gibier',
    subcategories: [
      { id: '5-1', name: 'Poisson frais', slug: 'poisson-frais', icon: '🐟' },
      { id: '5-2', name: 'Poisson fumé', slug: 'poisson-fume', icon: '🐠' },
      { id: '5-3', name: 'Viande de bœuf', slug: 'viande-boeuf', icon: '🥩' },
      { id: '5-4', name: 'Poulet', slug: 'poulet', icon: '🍗' },
      { id: '5-5', name: 'Escargots', slug: 'escargots', icon: '🐌' },
      { id: '5-6', name: 'Gibier', slug: 'gibier', icon: '🦌' },
      { id: '5-7', name: 'Crevettes & Fruits de mer', slug: 'crevettes-fruits-mer', icon: '🦐' },
    ]
  },
  { 
    id: '6', name: 'Épices & Condiments', slug: 'epices-condiments', icon: '🌶️', 
    description: 'Piment, soumbala, cube, huile de palme, dawadawa',
    subcategories: [
      { id: '6-1', name: 'Piments', slug: 'piments', icon: '🌶️' },
      { id: '6-2', name: 'Soumbala', slug: 'soumbala', icon: '🫘' },
      { id: '6-3', name: 'Huile de palme', slug: 'huile-palme', icon: '🫒' },
      { id: '6-4', name: 'Cubes & Bouillons', slug: 'cubes-bouillons', icon: '🧂' },
      { id: '6-5', name: 'Épices en poudre', slug: 'epices-poudre', icon: '🥄' },
    ]
  },
  { 
    id: '7', name: 'Boissons', slug: 'boissons', icon: '🧃', 
    description: 'Jus naturels, bissap, gingembre, bandji, vin de palme',
    subcategories: [
      { id: '7-1', name: 'Jus naturels', slug: 'jus-naturels', icon: '🍹' },
      { id: '7-2', name: 'Bissap', slug: 'bissap', icon: '🌺' },
      { id: '7-3', name: 'Gingembre', slug: 'gingembre', icon: '🫚' },
      { id: '7-4', name: 'Vin de palme', slug: 'vin-palme', icon: '🌴' },
      { id: '7-5', name: 'Bandji', slug: 'bandji', icon: '🥥' },
      { id: '7-6', name: 'Sodas & Eaux', slug: 'sodas-eaux', icon: '🥤' },
    ]
  },
  { 
    id: '8', name: 'Boulangerie & Pâtisserie', slug: 'boulangerie', icon: '🥐', 
    description: 'Pain, pâtisseries, gâteaux, viennoiseries',
    subcategories: [
      { id: '8-1', name: 'Pain', slug: 'pain', icon: '🥖' },
      { id: '8-2', name: 'Viennoiseries', slug: 'viennoiseries', icon: '🥐' },
      { id: '8-3', name: 'Gâteaux', slug: 'gateaux', icon: '🎂' },
      { id: '8-4', name: 'Beignets', slug: 'beignets', icon: '🍩' },
    ]
  },
  { 
    id: '9', name: 'Épicerie & Supermarché', slug: 'epicerie', icon: '🛒', 
    description: 'Produits alimentaires, conserves, produits laitiers',
    subcategories: [
      { id: '9-1', name: 'Conserves', slug: 'conserves', icon: '🥫' },
      { id: '9-2', name: 'Produits laitiers', slug: 'produits-laitiers', icon: '🥛' },
      { id: '9-3', name: 'Huiles & Vinaigres', slug: 'huiles-vinaigres', icon: '🫒' },
      { id: '9-4', name: 'Sucre & Café', slug: 'sucre-cafe', icon: '☕' },
      { id: '9-5', name: 'Pâtes & Semoule', slug: 'pates-semoule', icon: '🍝' },
    ]
  },

  // === MODE & BEAUTÉ ===
  { 
    id: '10', name: 'Mode Femme', slug: 'mode-femme', icon: '👗', 
    description: 'Robes, pagnes, ensembles, tenues traditionnelles',
    subcategories: [
      { id: '10-1', name: 'Robes', slug: 'robes', icon: '👗' },
      { id: '10-2', name: 'Ensembles', slug: 'ensembles-femme', icon: '👚' },
      { id: '10-3', name: 'Jupes', slug: 'jupes', icon: '🩱' },
      { id: '10-4', name: 'Pantalons femme', slug: 'pantalons-femme', icon: '👖' },
      { id: '10-5', name: 'Tenues traditionnelles', slug: 'tenues-traditionnelles-femme', icon: '🎎' },
      { id: '10-6', name: 'Lingerie', slug: 'lingerie', icon: '👙' },
    ]
  },
  { 
    id: '11', name: 'Mode Homme', slug: 'mode-homme', icon: '👔', 
    description: 'Chemises, pantalons, boubous, costumes',
    subcategories: [
      { id: '11-1', name: 'Chemises', slug: 'chemises', icon: '👔' },
      { id: '11-2', name: 'Pantalons', slug: 'pantalons-homme', icon: '👖' },
      { id: '11-3', name: 'Boubous', slug: 'boubous', icon: '🥻' },
      { id: '11-4', name: 'Costumes', slug: 'costumes', icon: '🤵' },
      { id: '11-5', name: 'T-shirts & Polos', slug: 'tshirts-polos', icon: '👕' },
      { id: '11-6', name: 'Sous-vêtements homme', slug: 'sous-vetements-homme', icon: '🩲' },
    ]
  },
  { 
    id: '12', name: 'Mode Enfant', slug: 'mode-enfant', icon: '👶', 
    description: 'Vêtements bébé et enfants, uniformes scolaires',
    subcategories: [
      { id: '12-1', name: 'Vêtements bébé', slug: 'vetements-bebe', icon: '👶' },
      { id: '12-2', name: 'Vêtements fille', slug: 'vetements-fille', icon: '👧' },
      { id: '12-3', name: 'Vêtements garçon', slug: 'vetements-garcon', icon: '👦' },
      { id: '12-4', name: 'Uniformes scolaires', slug: 'uniformes-scolaires', icon: '🎒' },
    ]
  },
  { 
    id: '13', name: 'Chaussures', slug: 'chaussures', icon: '👟', 
    description: 'Chaussures homme, femme, enfant, sandales, baskets',
    subcategories: [
      { id: '13-1', name: 'Chaussures femme', slug: 'chaussures-femme', icon: '👠' },
      { id: '13-2', name: 'Chaussures homme', slug: 'chaussures-homme', icon: '👞' },
      { id: '13-3', name: 'Chaussures enfant', slug: 'chaussures-enfant', icon: '👟' },
      { id: '13-4', name: 'Sandales & Tongs', slug: 'sandales-tongs', icon: '🩴' },
      { id: '13-5', name: 'Baskets', slug: 'baskets', icon: '👟' },
      { id: '13-6', name: 'Bottes & Bottines', slug: 'bottes-bottines', icon: '🥾' },
    ]
  },
  { 
    id: '14', name: 'Sacs & Accessoires', slug: 'sacs-accessoires', icon: '👜', 
    description: 'Sacs à main, ceintures, montres, bijoux, lunettes',
    subcategories: [
      { id: '14-1', name: 'Sacs à main', slug: 'sacs-main', icon: '👜' },
      { id: '14-2', name: 'Sacs à dos', slug: 'sacs-dos', icon: '🎒' },
      { id: '14-3', name: 'Ceintures', slug: 'ceintures', icon: '🪢' },
      { id: '14-4', name: 'Montres', slug: 'montres', icon: '⌚' },
      { id: '14-5', name: 'Bijoux', slug: 'bijoux', icon: '💎' },
      { id: '14-6', name: 'Lunettes', slug: 'lunettes-mode', icon: '🕶️' },
      { id: '14-7', name: 'Chapeaux & Casquettes', slug: 'chapeaux-casquettes', icon: '🧢' },
    ]
  },
  { 
    id: '15', name: 'Pagnes & Tissus', slug: 'pagnes-tissus', icon: '🧵', 
    description: 'Wax, bazin, kente, bogolan, dentelle, soie',
    subcategories: [
      { id: '15-1', name: 'Wax', slug: 'wax', icon: '🎨' },
      { id: '15-2', name: 'Bazin', slug: 'bazin', icon: '✨' },
      { id: '15-3', name: 'Kente', slug: 'kente', icon: '🧣' },
      { id: '15-4', name: 'Bogolan', slug: 'bogolan', icon: '🎭' },
      { id: '15-5', name: 'Dentelle', slug: 'dentelle', icon: '🪡' },
      { id: '15-6', name: 'Soie & Satin', slug: 'soie-satin', icon: '🎀' },
    ]
  },
  { 
    id: '16', name: 'Beauté & Cosmétiques', slug: 'beaute', icon: '💄', 
    description: 'Maquillage, soins peau, produits capillaires',
    subcategories: [
      { id: '16-1', name: 'Maquillage', slug: 'maquillage', icon: '💄' },
      { id: '16-2', name: 'Soins visage', slug: 'soins-visage', icon: '🧴' },
      { id: '16-3', name: 'Soins corps', slug: 'soins-corps', icon: '🧼' },
      { id: '16-4', name: 'Produits capillaires', slug: 'produits-capillaires', icon: '💇‍♀️' },
      { id: '16-5', name: 'Vernis & Ongles', slug: 'vernis-ongles', icon: '💅' },
    ]
  },
  { 
    id: '17', name: 'Perruques & Mèches', slug: 'perruques-meches', icon: '💇‍♀️', 
    description: 'Perruques, tissages, mèches brésiliennes, extensions',
    subcategories: [
      { id: '17-1', name: 'Perruques naturelles', slug: 'perruques-naturelles', icon: '👩' },
      { id: '17-2', name: 'Perruques synthétiques', slug: 'perruques-synthetiques', icon: '💇' },
      { id: '17-3', name: 'Mèches brésiliennes', slug: 'meches-bresiliennes', icon: '✨' },
      { id: '17-4', name: 'Extensions', slug: 'extensions', icon: '🎀' },
      { id: '17-5', name: 'Tissages', slug: 'tissages', icon: '🧵' },
    ]
  },
  { 
    id: '18', name: 'Parfums', slug: 'parfums', icon: '🌸', 
    description: 'Parfums homme et femme, huiles essentielles',
    subcategories: [
      { id: '18-1', name: 'Parfums femme', slug: 'parfums-femme', icon: '🌸' },
      { id: '18-2', name: 'Parfums homme', slug: 'parfums-homme', icon: '🌿' },
      { id: '18-3', name: 'Parfums arabes', slug: 'parfums-arabes', icon: '🕌' },
      { id: '18-4', name: 'Huiles essentielles', slug: 'huiles-essentielles', icon: '💧' },
      { id: '18-5', name: 'Encens', slug: 'encens', icon: '🔥' },
    ]
  },

  // === ÉLECTRONIQUE & HIGH-TECH ===
  { 
    id: '19', name: 'Téléphones & Tablettes', slug: 'telephones-tablettes', icon: '📱', 
    description: 'Smartphones, tablettes, accessoires téléphone',
    subcategories: [
      { id: '19-1', name: 'Smartphones', slug: 'smartphones', icon: '📱' },
      { id: '19-2', name: 'Téléphones basiques', slug: 'telephones-basiques', icon: '📞' },
      { id: '19-3', name: 'Tablettes', slug: 'tablettes', icon: '📲' },
      { id: '19-4', name: 'Coques & Protections', slug: 'coques-protections', icon: '🛡️' },
      { id: '19-5', name: 'Chargeurs & Câbles', slug: 'chargeurs-cables', icon: '🔌' },
      { id: '19-6', name: 'Écouteurs & Kits mains libres', slug: 'ecouteurs-kits', icon: '🎧' },
      { id: '19-7', name: 'Power Banks', slug: 'power-banks', icon: '🔋' },
    ]
  },
  { 
    id: '20', name: 'Ordinateurs', slug: 'ordinateurs', icon: '💻', 
    description: 'PC portables, PC bureau, accessoires informatiques',
    subcategories: [
      { id: '20-1', name: 'PC Portables', slug: 'pc-portables', icon: '💻' },
      { id: '20-2', name: 'PC Bureau', slug: 'pc-bureau', icon: '🖥️' },
      { id: '20-3', name: 'Écrans & Moniteurs', slug: 'ecrans-moniteurs', icon: '🖥️' },
      { id: '20-4', name: 'Claviers', slug: 'claviers', icon: '⌨️' },
      { id: '20-5', name: 'Souris', slug: 'souris', icon: '🖱️' },
      { id: '20-6', name: 'Disques durs & SSD', slug: 'disques-durs-ssd', icon: '💾' },
      { id: '20-7', name: 'Imprimantes', slug: 'imprimantes', icon: '🖨️' },
      { id: '20-8', name: 'Composants PC', slug: 'composants-pc', icon: '🔧' },
    ]
  },
  { 
    id: '21', name: 'TV & Home Cinéma', slug: 'tv-home-cinema', icon: '📺', 
    description: 'Télévisions, décodeurs, home cinéma, projecteurs',
    subcategories: [
      { id: '21-1', name: 'Télévisions', slug: 'televisions', icon: '📺' },
      { id: '21-2', name: 'Décodeurs', slug: 'decodeurs', icon: '📡' },
      { id: '21-3', name: 'Home Cinéma', slug: 'home-cinema', icon: '🎬' },
      { id: '21-4', name: 'Projecteurs', slug: 'projecteurs', icon: '📽️' },
      { id: '21-5', name: 'Supports TV', slug: 'supports-tv', icon: '📐' },
    ]
  },
  { 
    id: '22', name: 'Audio & Casques', slug: 'audio-casques', icon: '🎧', 
    description: 'Écouteurs, casques, enceintes Bluetooth, barres de son',
    subcategories: [
      { id: '22-1', name: 'Casques audio', slug: 'casques-audio', icon: '🎧' },
      { id: '22-2', name: 'Écouteurs filaires', slug: 'ecouteurs-filaires', icon: '🎵' },
      { id: '22-3', name: 'Écouteurs Bluetooth', slug: 'ecouteurs-bluetooth', icon: '📶' },
      { id: '22-4', name: 'Enceintes Bluetooth', slug: 'enceintes-bluetooth', icon: '🔊' },
      { id: '22-5', name: 'Barres de son', slug: 'barres-son', icon: '🔉' },
    ]
  },
  { 
    id: '23', name: 'Jeux Vidéo & Consoles', slug: 'jeux-video', icon: '🎮', 
    description: 'PlayStation, Xbox, Nintendo, jeux, manettes',
    subcategories: [
      { id: '23-1', name: 'PlayStation', slug: 'playstation', icon: '🎮' },
      { id: '23-2', name: 'Xbox', slug: 'xbox', icon: '🎯' },
      { id: '23-3', name: 'Nintendo', slug: 'nintendo', icon: '🕹️' },
      { id: '23-4', name: 'Jeux vidéo', slug: 'jeux', icon: '💿' },
      { id: '23-5', name: 'Manettes & Accessoires', slug: 'manettes-accessoires', icon: '🕹️' },
    ]
  },
  { 
    id: '24', name: 'Appareils Photo', slug: 'appareils-photo', icon: '📷', 
    description: 'Caméras, appareils photo, drones, GoPro',
    subcategories: [
      { id: '24-1', name: 'Appareils photo reflex', slug: 'appareils-reflex', icon: '📷' },
      { id: '24-2', name: 'Appareils compacts', slug: 'appareils-compacts', icon: '📸' },
      { id: '24-3', name: 'Caméras vidéo', slug: 'cameras-video', icon: '🎥' },
      { id: '24-4', name: 'Drones', slug: 'drones', icon: '🚁' },
      { id: '24-5', name: 'GoPro & Action cams', slug: 'gopro-action-cams', icon: '📹' },
      { id: '24-6', name: 'Objectifs & Accessoires', slug: 'objectifs-accessoires', icon: '🔭' },
    ]
  },
  { 
    id: '25', name: 'Accessoires Tech', slug: 'accessoires-tech', icon: '🔌', 
    description: 'Chargeurs, câbles, coques, power banks, cartes SD',
    subcategories: [
      { id: '25-1', name: 'Chargeurs universels', slug: 'chargeurs-universels', icon: '🔌' },
      { id: '25-2', name: 'Câbles USB', slug: 'cables-usb', icon: '🔗' },
      { id: '25-3', name: 'Cartes mémoire', slug: 'cartes-memoire', icon: '💾' },
      { id: '25-4', name: 'Clés USB', slug: 'cles-usb', icon: '📀' },
      { id: '25-5', name: 'Adaptateurs', slug: 'adaptateurs', icon: '🔄' },
    ]
  },

  // === ÉLECTROMÉNAGER ===
  { 
    id: '26', name: 'Gros Électroménager', slug: 'gros-electromenager', icon: '🧊', 
    description: 'Réfrigérateurs, congélateurs, machines à laver, cuisinières',
    subcategories: [
      { id: '26-1', name: 'Réfrigérateurs', slug: 'refrigerateurs', icon: '🧊' },
      { id: '26-2', name: 'Congélateurs', slug: 'congelateurs', icon: '❄️' },
      { id: '26-3', name: 'Machines à laver', slug: 'machines-laver', icon: '🧺' },
      { id: '26-4', name: 'Sèche-linge', slug: 'seche-linge', icon: '💨' },
      { id: '26-5', name: 'Cuisinières & Fours', slug: 'cuisinieres-fours', icon: '🔥' },
      { id: '26-6', name: 'Lave-vaisselle', slug: 'lave-vaisselle', icon: '🍽️' },
    ]
  },
  { 
    id: '27', name: 'Petit Électroménager', slug: 'petit-electromenager', icon: '🍳', 
    description: 'Mixeurs, blenders, micro-ondes, bouilloires, grille-pain',
    subcategories: [
      { id: '27-1', name: 'Mixeurs & Blenders', slug: 'mixeurs-blenders', icon: '🥤' },
      { id: '27-2', name: 'Micro-ondes', slug: 'micro-ondes', icon: '📦' },
      { id: '27-3', name: 'Bouilloires', slug: 'bouilloires', icon: '☕' },
      { id: '27-4', name: 'Grille-pain', slug: 'grille-pain', icon: '🍞' },
      { id: '27-5', name: 'Friteuses', slug: 'friteuses', icon: '🍟' },
      { id: '27-6', name: 'Robots cuisine', slug: 'robots-cuisine', icon: '🤖' },
      { id: '27-7', name: 'Cafetières', slug: 'cafetieres', icon: '☕' },
    ]
  },
  { 
    id: '28', name: 'Climatisation & Ventilation', slug: 'climatisation', icon: '❄️', 
    description: 'Climatiseurs, ventilateurs, purificateurs d\'air',
    subcategories: [
      { id: '28-1', name: 'Climatiseurs split', slug: 'climatiseurs-split', icon: '❄️' },
      { id: '28-2', name: 'Climatiseurs mobiles', slug: 'climatiseurs-mobiles', icon: '🌬️' },
      { id: '28-3', name: 'Ventilateurs', slug: 'ventilateurs', icon: '🌀' },
      { id: '28-4', name: 'Purificateurs d\'air', slug: 'purificateurs-air', icon: '💨' },
      { id: '28-5', name: 'Humidificateurs', slug: 'humidificateurs', icon: '💧' },
    ]
  },
  { 
    id: '29', name: 'Fer & Entretien', slug: 'fer-entretien', icon: '🧹', 
    description: 'Fers à repasser, aspirateurs, nettoyeurs vapeur',
    subcategories: [
      { id: '29-1', name: 'Fers à repasser', slug: 'fers-repasser', icon: '👔' },
      { id: '29-2', name: 'Centrales vapeur', slug: 'centrales-vapeur', icon: '💨' },
      { id: '29-3', name: 'Aspirateurs', slug: 'aspirateurs', icon: '🧹' },
      { id: '29-4', name: 'Nettoyeurs vapeur', slug: 'nettoyeurs-vapeur', icon: '♨️' },
    ]
  },

  // === MAISON & JARDIN ===
  { 
    id: '30', name: 'Meubles', slug: 'meubles', icon: '🛋️', 
    description: 'Canapés, lits, armoires, tables, chaises',
    subcategories: [
      { id: '30-1', name: 'Canapés & Salons', slug: 'canapes-salons', icon: '🛋️' },
      { id: '30-2', name: 'Lits', slug: 'lits', icon: '🛏️' },
      { id: '30-3', name: 'Armoires', slug: 'armoires', icon: '🚪' },
      { id: '30-4', name: 'Tables', slug: 'tables', icon: '🪑' },
      { id: '30-5', name: 'Chaises', slug: 'chaises', icon: '💺' },
      { id: '30-6', name: 'Étagères', slug: 'etageres', icon: '📚' },
    ]
  },
  { 
    id: '31', name: 'Décoration', slug: 'decoration', icon: '🖼️', 
    description: 'Tableaux, rideaux, tapis, coussins, vases',
    subcategories: [
      { id: '31-1', name: 'Tableaux & Cadres', slug: 'tableaux-cadres', icon: '🖼️' },
      { id: '31-2', name: 'Rideaux', slug: 'rideaux', icon: '🪟' },
      { id: '31-3', name: 'Tapis', slug: 'tapis', icon: '🧶' },
      { id: '31-4', name: 'Coussins', slug: 'coussins', icon: '🛋️' },
      { id: '31-5', name: 'Vases & Plantes', slug: 'vases-plantes', icon: '🌸' },
      { id: '31-6', name: 'Luminaires', slug: 'luminaires', icon: '💡' },
    ]
  },
  { 
    id: '32', name: 'Literie', slug: 'literie', icon: '🛏️', 
    description: 'Matelas, draps, couettes, oreillers',
    subcategories: [
      { id: '32-1', name: 'Matelas', slug: 'matelas', icon: '🛏️' },
      { id: '32-2', name: 'Draps & Housses', slug: 'draps-housses', icon: '🧺' },
      { id: '32-3', name: 'Couettes & Couvertures', slug: 'couettes-couvertures', icon: '🛌' },
      { id: '32-4', name: 'Oreillers', slug: 'oreillers', icon: '😴' },
    ]
  },
  { 
    id: '33', name: 'Cuisine & Arts de Table', slug: 'cuisine-table', icon: '🍽️', 
    description: 'Ustensiles, vaisselle, casseroles, verres',
    subcategories: [
      { id: '33-1', name: 'Casseroles & Poêles', slug: 'casseroles-poeles', icon: '🍳' },
      { id: '33-2', name: 'Vaisselle', slug: 'vaisselle', icon: '🍽️' },
      { id: '33-3', name: 'Verres & Gobelets', slug: 'verres-gobelets', icon: '🥛' },
      { id: '33-4', name: 'Couverts', slug: 'couverts', icon: '🍴' },
      { id: '33-5', name: 'Ustensiles cuisine', slug: 'ustensiles-cuisine', icon: '🥄' },
    ]
  },
  { 
    id: '34', name: 'Rangement', slug: 'rangement', icon: '📦', 
    description: 'Étagères, boîtes, organisateurs, placards',
    subcategories: [
      { id: '34-1', name: 'Boîtes de rangement', slug: 'boites-rangement', icon: '📦' },
      { id: '34-2', name: 'Paniers', slug: 'paniers', icon: '🧺' },
      { id: '34-3', name: 'Cintres', slug: 'cintres', icon: '👔' },
      { id: '34-4', name: 'Organisateurs', slug: 'organisateurs', icon: '🗂️' },
    ]
  },
  { 
    id: '35', name: 'Jardin & Extérieur', slug: 'jardin-exterieur', icon: '🌿', 
    description: 'Plantes, outils jardinage, meubles extérieur, barbecues',
    subcategories: [
      { id: '35-1', name: 'Plantes & Pots', slug: 'plantes-pots', icon: '🌱' },
      { id: '35-2', name: 'Outils jardinage', slug: 'outils-jardinage', icon: '🌿' },
      { id: '35-3', name: 'Meubles jardin', slug: 'meubles-jardin', icon: '🪑' },
      { id: '35-4', name: 'Barbecues', slug: 'barbecues', icon: '🍖' },
      { id: '35-5', name: 'Parasols & Tonnelles', slug: 'parasols-tonnelles', icon: '⛱️' },
    ]
  },
  { 
    id: '36', name: 'Bricolage & Outillage', slug: 'bricolage', icon: '🔨', 
    description: 'Outils, perceuses, peinture, électricité, plomberie',
    subcategories: [
      { id: '36-1', name: 'Outils à main', slug: 'outils-main', icon: '🔧' },
      { id: '36-2', name: 'Outils électriques', slug: 'outils-electriques', icon: '🔌' },
      { id: '36-3', name: 'Peinture', slug: 'peinture', icon: '🎨' },
      { id: '36-4', name: 'Électricité', slug: 'electricite', icon: '⚡' },
      { id: '36-5', name: 'Plomberie', slug: 'plomberie', icon: '🚿' },
    ]
  },
  { 
    id: '37', name: 'Quincaillerie', slug: 'quincaillerie', icon: '🔩', 
    description: 'Vis, clous, serrures, poignées, accessoires',
    subcategories: [
      { id: '37-1', name: 'Vis & Clous', slug: 'vis-clous', icon: '🔩' },
      { id: '37-2', name: 'Serrures', slug: 'serrures', icon: '🔐' },
      { id: '37-3', name: 'Poignées', slug: 'poignees', icon: '🚪' },
      { id: '37-4', name: 'Chaînes & Cadenas', slug: 'chaines-cadenas', icon: '🔒' },
    ]
  },

  // === AUTO-MOTO ===
  { 
    id: '38', name: 'Voitures', slug: 'voitures', icon: '🚗', 
    description: 'Voitures neuves et occasion, SUV, berlines',
    subcategories: [
      { id: '38-1', name: 'Berlines', slug: 'berlines', icon: '🚗' },
      { id: '38-2', name: 'SUV & 4x4', slug: 'suv-4x4', icon: '🚙' },
      { id: '38-3', name: 'Pick-up', slug: 'pick-up', icon: '🛻' },
      { id: '38-4', name: 'Citadines', slug: 'citadines', icon: '🚘' },
      { id: '38-5', name: 'Utilitaires', slug: 'utilitaires', icon: '🚐' },
    ]
  },
  { 
    id: '39', name: 'Motos & Scooters', slug: 'motos-scooters', icon: '🏍️', 
    description: 'Motos, scooters, tricycles, vélos',
    subcategories: [
      { id: '39-1', name: 'Motos', slug: 'motos', icon: '🏍️' },
      { id: '39-2', name: 'Scooters', slug: 'scooters', icon: '🛵' },
      { id: '39-3', name: 'Tricycles', slug: 'tricycles', icon: '🛺' },
      { id: '39-4', name: 'Vélos', slug: 'velos', icon: '🚲' },
      { id: '39-5', name: 'Vélos électriques', slug: 'velos-electriques', icon: '🔋' },
    ]
  },
  { 
    id: '40', name: 'Pièces Auto', slug: 'pieces-auto', icon: '⚙️', 
    description: 'Pièces détachées, pneus, batteries, huiles',
    subcategories: [
      { id: '40-1', name: 'Pneus', slug: 'pneus', icon: '🛞' },
      { id: '40-2', name: 'Batteries', slug: 'batteries-auto', icon: '🔋' },
      { id: '40-3', name: 'Huiles & Lubrifiants', slug: 'huiles-lubrifiants', icon: '🛢️' },
      { id: '40-4', name: 'Freins', slug: 'freins', icon: '🛑' },
      { id: '40-5', name: 'Filtres', slug: 'filtres', icon: '🔧' },
      { id: '40-6', name: 'Ampoules auto', slug: 'ampoules-auto', icon: '💡' },
    ]
  },
  { 
    id: '41', name: 'Accessoires Auto', slug: 'accessoires-auto', icon: '🚙', 
    description: 'GPS, caméras embarquées, housses, tapis',
    subcategories: [
      { id: '41-1', name: 'GPS & Navigation', slug: 'gps-navigation', icon: '📍' },
      { id: '41-2', name: 'Caméras embarquées', slug: 'cameras-embarquees', icon: '📹' },
      { id: '41-3', name: 'Housses & Tapis', slug: 'housses-tapis', icon: '🪑' },
      { id: '41-4', name: 'Entretien auto', slug: 'entretien-auto', icon: '🧽' },
      { id: '41-5', name: 'Casques moto', slug: 'casques-moto', icon: '⛑️' },
    ]
  },

  // === SPORT & LOISIRS ===
  { 
    id: '42', name: 'Sport & Fitness', slug: 'sport-fitness', icon: '⚽', 
    description: 'Équipements sport, fitness, musculation, vélos',
    subcategories: [
      { id: '42-1', name: 'Football', slug: 'football', icon: '⚽' },
      { id: '42-2', name: 'Basketball', slug: 'basketball', icon: '🏀' },
      { id: '42-3', name: 'Musculation', slug: 'musculation', icon: '🏋️' },
      { id: '42-4', name: 'Fitness', slug: 'fitness', icon: '🏃' },
      { id: '42-5', name: 'Natation', slug: 'natation', icon: '🏊' },
      { id: '42-6', name: 'Tennis', slug: 'tennis', icon: '🎾' },
    ]
  },
  { 
    id: '43', name: 'Vêtements Sport', slug: 'vetements-sport', icon: '👕', 
    description: 'Maillots, survêtements, chaussures sport',
    subcategories: [
      { id: '43-1', name: 'Maillots', slug: 'maillots', icon: '👕' },
      { id: '43-2', name: 'Survêtements', slug: 'survetements', icon: '🧥' },
      { id: '43-3', name: 'Chaussures sport', slug: 'chaussures-sport', icon: '👟' },
      { id: '43-4', name: 'Maillots de bain', slug: 'maillots-bain', icon: '🩱' },
    ]
  },
  { 
    id: '44', name: 'Camping & Plein Air', slug: 'camping-plein-air', icon: '⛺', 
    description: 'Tentes, sacs de couchage, lampes, glacières',
    subcategories: [
      { id: '44-1', name: 'Tentes', slug: 'tentes', icon: '⛺' },
      { id: '44-2', name: 'Sacs de couchage', slug: 'sacs-couchage', icon: '🛌' },
      { id: '44-3', name: 'Lampes & Torches', slug: 'lampes-torches', icon: '🔦' },
      { id: '44-4', name: 'Glacières', slug: 'glacieres', icon: '🧊' },
    ]
  },
  { 
    id: '45', name: 'Instruments de Musique', slug: 'instruments-musique', icon: '🎸', 
    description: 'Guitares, claviers, djembés, percussions',
    subcategories: [
      { id: '45-1', name: 'Guitares', slug: 'guitares', icon: '🎸' },
      { id: '45-2', name: 'Claviers & Pianos', slug: 'claviers-pianos', icon: '🎹' },
      { id: '45-3', name: 'Djembés & Percussions', slug: 'djembes-percussions', icon: '🥁' },
      { id: '45-4', name: 'Instruments à vent', slug: 'instruments-vent', icon: '🎺' },
    ]
  },

  // === SANTÉ & BIEN-ÊTRE ===
  { 
    id: '46', name: 'Pharmacie & Santé', slug: 'pharmacie-sante', icon: '💊', 
    description: 'Médicaments, vitamines, premiers soins',
    subcategories: [
      { id: '46-1', name: 'Vitamines & Compléments', slug: 'vitamines-complements', icon: '💊' },
      { id: '46-2', name: 'Premiers soins', slug: 'premiers-soins', icon: '🩹' },
      { id: '46-3', name: 'Hygiène', slug: 'hygiene', icon: '🧴' },
      { id: '46-4', name: 'Contraception', slug: 'contraception', icon: '💟' },
    ]
  },
  { 
    id: '47', name: 'Médecine Traditionnelle', slug: 'medecine-traditionnelle', icon: '🌿', 
    description: 'Plantes médicinales, remèdes naturels, tisanes',
    subcategories: [
      { id: '47-1', name: 'Plantes médicinales', slug: 'plantes-medicinales', icon: '🌿' },
      { id: '47-2', name: 'Tisanes', slug: 'tisanes', icon: '🍵' },
      { id: '47-3', name: 'Huiles naturelles', slug: 'huiles-naturelles', icon: '💧' },
      { id: '47-4', name: 'Remèdes traditionnels', slug: 'remedes-traditionnels', icon: '🏺' },
    ]
  },
  { 
    id: '48', name: 'Optique', slug: 'optique', icon: '👓', 
    description: 'Lunettes de vue, lunettes soleil, lentilles',
    subcategories: [
      { id: '48-1', name: 'Lunettes de vue', slug: 'lunettes-vue', icon: '👓' },
      { id: '48-2', name: 'Lunettes soleil', slug: 'lunettes-soleil', icon: '🕶️' },
      { id: '48-3', name: 'Lentilles', slug: 'lentilles', icon: '👁️' },
    ]
  },
  { 
    id: '49', name: 'Matériel Médical', slug: 'materiel-medical', icon: '🩺', 
    description: 'Tensiomètres, thermomètres, fauteuils roulants',
    subcategories: [
      { id: '49-1', name: 'Tensiomètres', slug: 'tensiometres', icon: '❤️' },
      { id: '49-2', name: 'Thermomètres', slug: 'thermometres', icon: '🌡️' },
      { id: '49-3', name: 'Fauteuils roulants', slug: 'fauteuils-roulants', icon: '♿' },
      { id: '49-4', name: 'Béquilles & Cannes', slug: 'bequilles-cannes', icon: '🦯' },
    ]
  },

  // === BÉBÉ & ENFANT ===
  { 
    id: '50', name: 'Puériculture', slug: 'puericulture', icon: '🍼', 
    description: 'Biberons, poussettes, sièges auto, couches',
    subcategories: [
      { id: '50-1', name: 'Biberons & Tétines', slug: 'biberons-tetines', icon: '🍼' },
      { id: '50-2', name: 'Poussettes', slug: 'poussettes', icon: '🚼' },
      { id: '50-3', name: 'Sièges auto', slug: 'sieges-auto', icon: '🚗' },
      { id: '50-4', name: 'Couches', slug: 'couches', icon: '👶' },
      { id: '50-5', name: 'Lits bébé', slug: 'lits-bebe', icon: '🛏️' },
    ]
  },
  { 
    id: '51', name: 'Jouets', slug: 'jouets', icon: '🧸', 
    description: 'Jouets enfants, jeux éducatifs, poupées, voitures',
    subcategories: [
      { id: '51-1', name: 'Jouets bébé', slug: 'jouets-bebe', icon: '🧸' },
      { id: '51-2', name: 'Poupées', slug: 'poupees', icon: '👧' },
      { id: '51-3', name: 'Voitures & Véhicules', slug: 'voitures-vehicules', icon: '🚗' },
      { id: '51-4', name: 'Jeux éducatifs', slug: 'jeux-educatifs', icon: '🎓' },
      { id: '51-5', name: 'Jeux de société', slug: 'jeux-societe', icon: '🎲' },
    ]
  },
  { 
    id: '52', name: 'Fournitures Scolaires', slug: 'fournitures-scolaires', icon: '📚', 
    description: 'Cahiers, stylos, sacs à dos, manuels scolaires',
    subcategories: [
      { id: '52-1', name: 'Cahiers & Feuilles', slug: 'cahiers-feuilles', icon: '📓' },
      { id: '52-2', name: 'Stylos & Crayons', slug: 'stylos-crayons', icon: '✏️' },
      { id: '52-3', name: 'Sacs scolaires', slug: 'sacs-scolaires', icon: '🎒' },
      { id: '52-4', name: 'Manuels scolaires', slug: 'manuels-scolaires', icon: '📖' },
      { id: '52-5', name: 'Calculatrices', slug: 'calculatrices', icon: '🔢' },
    ]
  },

  // === BUREAU & ENTREPRISE ===
  { 
    id: '53', name: 'Fournitures Bureau', slug: 'fournitures-bureau', icon: '📎', 
    description: 'Papeterie, classeurs, imprimantes, photocopieuses',
    subcategories: [
      { id: '53-1', name: 'Papeterie', slug: 'papeterie', icon: '📝' },
      { id: '53-2', name: 'Classeurs & Dossiers', slug: 'classeurs-dossiers', icon: '📁' },
      { id: '53-3', name: 'Imprimantes', slug: 'imprimantes-bureau', icon: '🖨️' },
      { id: '53-4', name: 'Photocopieuses', slug: 'photocopieuses', icon: '📄' },
      { id: '53-5', name: 'Agrafeuses & Perforeuses', slug: 'agrafeuses-perforeuses', icon: '📎' },
    ]
  },
  { 
    id: '54', name: 'Mobilier Bureau', slug: 'mobilier-bureau', icon: '🪑', 
    description: 'Bureaux, chaises ergonomiques, armoires',
    subcategories: [
      { id: '54-1', name: 'Bureaux', slug: 'bureaux', icon: '🪑' },
      { id: '54-2', name: 'Chaises bureau', slug: 'chaises-bureau', icon: '💺' },
      { id: '54-3', name: 'Armoires bureau', slug: 'armoires-bureau', icon: '🚪' },
      { id: '54-4', name: 'Caissons', slug: 'caissons', icon: '📦' },
    ]
  },
  { 
    id: '55', name: 'Équipement Pro', slug: 'equipement-pro', icon: '🏭', 
    description: 'Matériel industriel, machines, outils pro',
    subcategories: [
      { id: '55-1', name: 'Machines industrielles', slug: 'machines-industrielles', icon: '🏭' },
      { id: '55-2', name: 'Générateurs', slug: 'generateurs', icon: '⚡' },
      { id: '55-3', name: 'Compresseurs', slug: 'compresseurs', icon: '💨' },
      { id: '55-4', name: 'Soudure', slug: 'soudure', icon: '🔥' },
    ]
  },

  // === IMMOBILIER ===
  { 
    id: '56', name: 'Locations', slug: 'locations-immobilier', icon: '🏢', 
    description: 'Appartements, maisons, bureaux à louer',
    subcategories: [
      { id: '56-1', name: 'Appartements à louer', slug: 'appartements-louer', icon: '🏢' },
      { id: '56-2', name: 'Maisons à louer', slug: 'maisons-louer', icon: '🏠' },
      { id: '56-3', name: 'Bureaux à louer', slug: 'bureaux-louer', icon: '🏬' },
      { id: '56-4', name: 'Locaux commerciaux', slug: 'locaux-commerciaux', icon: '🏪' },
    ]
  },
  { 
    id: '57', name: 'Ventes Immobilier', slug: 'ventes-immobilier', icon: '🏡', 
    description: 'Maisons, terrains, appartements à vendre',
    subcategories: [
      { id: '57-1', name: 'Maisons à vendre', slug: 'maisons-vendre', icon: '🏡' },
      { id: '57-2', name: 'Appartements à vendre', slug: 'appartements-vendre', icon: '🏢' },
      { id: '57-3', name: 'Terrains', slug: 'terrains', icon: '🌍' },
      { id: '57-4', name: 'Immeubles', slug: 'immeubles', icon: '🏗️' },
    ]
  },

  // === SERVICES ===
  { 
    id: '58', name: 'Artisanat & Création', slug: 'artisanat', icon: '🎨', 
    description: 'Produits artisanaux, créations locales, sculptures',
    subcategories: [
      { id: '58-1', name: 'Sculptures', slug: 'sculptures', icon: '🗿' },
      { id: '58-2', name: 'Tableaux & Peintures', slug: 'tableaux-peintures', icon: '🎨' },
      { id: '58-3', name: 'Vannerie', slug: 'vannerie', icon: '🧺' },
      { id: '58-4', name: 'Poterie', slug: 'poterie', icon: '🏺' },
    ]
  },
  { 
    id: '59', name: 'Couture & Tailleur', slug: 'couture-tailleur', icon: '✂️', 
    description: 'Confection sur mesure, retouches, broderie',
    subcategories: [
      { id: '59-1', name: 'Confection sur mesure', slug: 'confection-mesure', icon: '👗' },
      { id: '59-2', name: 'Retouches', slug: 'retouches', icon: '✂️' },
      { id: '59-3', name: 'Broderie', slug: 'broderie', icon: '🪡' },
    ]
  },
  { 
    id: '60', name: 'Coiffure & Tresses', slug: 'coiffure-tresses', icon: '💇', 
    description: 'Tresses, coiffures, barbier, salon beauté',
    subcategories: [
      { id: '60-1', name: 'Tresses', slug: 'tresses', icon: '💇‍♀️' },
      { id: '60-2', name: 'Coiffure femme', slug: 'coiffure-femme', icon: '💁‍♀️' },
      { id: '60-3', name: 'Barbier', slug: 'barbier', icon: '💈' },
      { id: '60-4', name: 'Soins capillaires', slug: 'soins-capillaires', icon: '🧴' },
    ]
  },
  { 
    id: '61', name: 'Réparations', slug: 'reparations', icon: '🔧', 
    description: 'Électronique, électroménager, téléphones, ordinateurs',
    subcategories: [
      { id: '61-1', name: 'Réparation téléphones', slug: 'reparation-telephones', icon: '📱' },
      { id: '61-2', name: 'Réparation ordinateurs', slug: 'reparation-ordinateurs', icon: '💻' },
      { id: '61-3', name: 'Réparation électroménager', slug: 'reparation-electromenager', icon: '🔌' },
      { id: '61-4', name: 'Réparation climatiseurs', slug: 'reparation-climatiseurs', icon: '❄️' },
    ]
  },
  { 
    id: '62', name: 'Transport & Livraison', slug: 'transport-livraison', icon: '🚚', 
    description: 'Déménagement, livraison, transport marchandises',
    subcategories: [
      { id: '62-1', name: 'Déménagement', slug: 'demenagement', icon: '📦' },
      { id: '62-2', name: 'Livraison express', slug: 'livraison-express', icon: '🏃' },
      { id: '62-3', name: 'Transport marchandises', slug: 'transport-marchandises', icon: '🚛' },
    ]
  },
  { 
    id: '63', name: 'Événementiel', slug: 'evenementiel', icon: '🎉', 
    description: 'Location matériel, décoration, DJ, traiteur',
    subcategories: [
      { id: '63-1', name: 'Location matériel', slug: 'location-materiel', icon: '🎪' },
      { id: '63-2', name: 'Décoration événement', slug: 'decoration-evenement', icon: '🎈' },
      { id: '63-3', name: 'DJ & Animation', slug: 'dj-animation', icon: '🎧' },
      { id: '63-4', name: 'Traiteur', slug: 'traiteur', icon: '🍽️' },
      { id: '63-5', name: 'Photographe', slug: 'photographe', icon: '📸' },
    ]
  },
  { 
    id: '64', name: 'Cours & Formation', slug: 'cours-formation', icon: '📖', 
    description: 'Cours particuliers, formations, coaching',
    subcategories: [
      { id: '64-1', name: 'Cours particuliers', slug: 'cours-particuliers', icon: '👨‍🏫' },
      { id: '64-2', name: 'Langues', slug: 'langues', icon: '🌍' },
      { id: '64-3', name: 'Informatique', slug: 'cours-informatique', icon: '💻' },
      { id: '64-4', name: 'Musique', slug: 'cours-musique', icon: '🎵' },
      { id: '64-5', name: 'Coaching', slug: 'coaching', icon: '🎯' },
    ]
  },
  { 
    id: '65', name: 'Services Informatiques', slug: 'services-informatiques', icon: '🖥️', 
    description: 'Développement web, maintenance, dépannage',
    subcategories: [
      { id: '65-1', name: 'Développement web', slug: 'developpement-web', icon: '🌐' },
      { id: '65-2', name: 'Développement mobile', slug: 'developpement-mobile', icon: '📱' },
      { id: '65-3', name: 'Maintenance informatique', slug: 'maintenance-informatique', icon: '🔧' },
      { id: '65-4', name: 'Réseaux & Sécurité', slug: 'reseaux-securite', icon: '🔒' },
    ]
  },

  // === AGRICULTURE & ÉLEVAGE ===
  { 
    id: '66', name: 'Agriculture', slug: 'agriculture', icon: '🌱', 
    description: 'Semences, engrais, matériel agricole, récoltes',
    subcategories: [
      { id: '66-1', name: 'Semences', slug: 'semences', icon: '🌱' },
      { id: '66-2', name: 'Engrais', slug: 'engrais', icon: '🧪' },
      { id: '66-3', name: 'Matériel agricole', slug: 'materiel-agricole', icon: '🚜' },
      { id: '66-4', name: 'Pesticides', slug: 'pesticides', icon: '🧴' },
    ]
  },
  { 
    id: '67', name: 'Élevage', slug: 'elevage', icon: '🐄', 
    description: 'Bétail, volailles, aliments animaux, équipement',
    subcategories: [
      { id: '67-1', name: 'Bétail', slug: 'betail', icon: '🐄' },
      { id: '67-2', name: 'Volailles', slug: 'volailles', icon: '🐔' },
      { id: '67-3', name: 'Aliments animaux', slug: 'aliments-animaux', icon: '🌾' },
      { id: '67-4', name: 'Équipement élevage', slug: 'equipement-elevage', icon: '🏠' },
    ]
  },
  { 
    id: '68', name: 'Pêche & Aquaculture', slug: 'peche-aquaculture', icon: '🐟', 
    description: 'Matériel pêche, poissons, crevettes, aquariums',
    subcategories: [
      { id: '68-1', name: 'Matériel pêche', slug: 'materiel-peche', icon: '🎣' },
      { id: '68-2', name: 'Poissons vivants', slug: 'poissons-vivants', icon: '🐟' },
      { id: '68-3', name: 'Aquariums', slug: 'aquariums', icon: '🐠' },
    ]
  },

  // === ANIMAUX ===
  { 
    id: '69', name: 'Animaux de Compagnie', slug: 'animaux-compagnie', icon: '🐕', 
    description: 'Chiens, chats, oiseaux, accessoires, nourriture',
    subcategories: [
      { id: '69-1', name: 'Chiens', slug: 'chiens', icon: '🐕' },
      { id: '69-2', name: 'Chats', slug: 'chats', icon: '🐈' },
      { id: '69-3', name: 'Oiseaux', slug: 'oiseaux', icon: '🦜' },
      { id: '69-4', name: 'Nourriture animaux', slug: 'nourriture-animaux', icon: '🥫' },
      { id: '69-5', name: 'Accessoires animaux', slug: 'accessoires-animaux', icon: '🦴' },
    ]
  },

  // === DIVERS ===
  { 
    id: '70', name: 'Occasions & Seconde Main', slug: 'occasions', icon: '♻️', 
    description: 'Articles d\'occasion, vintage, seconde main',
    subcategories: [
      { id: '70-1', name: 'Vêtements occasion', slug: 'vetements-occasion', icon: '👕' },
      { id: '70-2', name: 'Électronique occasion', slug: 'electronique-occasion', icon: '📱' },
      { id: '70-3', name: 'Meubles occasion', slug: 'meubles-occasion', icon: '🛋️' },
      { id: '70-4', name: 'Vintage', slug: 'vintage', icon: '🕰️' },
    ]
  },
  { 
    id: '71', name: 'Gros & Demi-Gros', slug: 'gros-demi-gros', icon: '📦', 
    description: 'Vente en gros, import-export, destockage',
    subcategories: [
      { id: '71-1', name: 'Alimentaire en gros', slug: 'alimentaire-gros', icon: '🥫' },
      { id: '71-2', name: 'Textile en gros', slug: 'textile-gros', icon: '👕' },
      { id: '71-3', name: 'Électronique en gros', slug: 'electronique-gros', icon: '📱' },
      { id: '71-4', name: 'Destockage', slug: 'destockage', icon: '💰' },
    ]
  },
  { 
    id: '72', name: 'Made in Côte d\'Ivoire', slug: 'made-in-ci', icon: '🇨🇮', 
    description: 'Produits 100% ivoiriens, artisanat local',
    subcategories: [
      { id: '72-1', name: 'Produits alimentaires CI', slug: 'produits-alimentaires-ci', icon: '🍫' },
      { id: '72-2', name: 'Mode ivoirienne', slug: 'mode-ivoirienne', icon: '👗' },
      { id: '72-3', name: 'Artisanat ivoirien', slug: 'artisanat-ivoirien', icon: '🎭' },
      { id: '72-4', name: 'Cosmétiques locaux', slug: 'cosmetiques-locaux', icon: '🧴' },
    ]
  },
];

// Produits de démonstration - Du marché traditionnel aux boutiques modernes !
export const products: Product[] = [
  // === LÉGUMES & FRUITS ===
  {
    id: '200',
    title: 'Tomates fraîches',
    description: 'Tomates rouges bien mûres du jardin. Idéales pour vos sauces.',
    price: 500,
    stock: 50,
    images: ['https://images.unsplash.com/photo-1546470427-227c7b5b8898?w=400'],
    category: 'legumes-fruits',
    shopId: '20',
    shopName: 'Maman Awa - Légumes',
    status: 'published',
    createdAt: new Date('2023-11-10'),
    isPerishable: true,
    unit: 'piece',
  },
  {
    id: '201',
    title: 'Aubergines locales',
    description: 'Aubergines violettes fraîches. Parfaites pour la sauce aubergine.',
    price: 300,
    stock: 40,
    images: ['https://images.unsplash.com/photo-1528826007177-f38517ce0a6c?w=400'],
    category: 'legumes-fruits',
    shopId: '20',
    shopName: 'Maman Awa - Légumes',
    status: 'published',
    createdAt: new Date('2023-11-10'),
    isPerishable: true,
    unit: 'piece',
  },
  {
    id: '202',
    title: 'Gombo frais',
    description: 'Gombo tendre pour sauce gluante. Récolte du matin.',
    price: 400,
    stock: 35,
    images: ['https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?w=400'],
    category: 'legumes-fruits',
    shopId: '20',
    shopName: 'Maman Awa - Légumes',
    status: 'published',
    createdAt: new Date('2023-11-10'),
    isPerishable: true,
    unit: 'piece',
  },
  {
    id: '203',
    title: 'Piment frais',
    description: 'Piment fort pour relever vos plats. Attention ça pique !',
    price: 200,
    stock: 60,
    images: ['https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=400'],
    category: 'legumes-fruits',
    shopId: '20',
    shopName: 'Maman Awa - Légumes',
    status: 'published',
    createdAt: new Date('2023-11-10'),
    isPerishable: true,
    unit: 'piece',
  },
  {
    id: '204',
    title: 'Oignons',
    description: 'Oignons frais du marché. Indispensables en cuisine.',
    price: 500,
    stock: 80,
    images: ['https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=400'],
    category: 'legumes-fruits',
    shopId: '21',
    shopName: 'Djakité Primeurs',
    status: 'published',
    createdAt: new Date('2023-11-10'),
    isPerishable: true,
    unit: 'kg',
  },
  // === ATTIÉKÉ & MANIOC ===
  {
    id: '210',
    title: 'Attiéké frais',
    description: 'Attiéké fait maison, préparé ce matin. Léger et savoureux.',
    price: 500,
    stock: 30,
    images: ['https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400'],
    category: 'attieke-manioc',
    shopId: '22',
    shopName: 'Tantie Adjoua Attiéké',
    status: 'published',
    createdAt: new Date('2023-11-10'),
    isPerishable: true,
    unit: 'piece',
  },
  {
    id: '211',
    title: 'Placali',
    description: 'Placali moelleux fait à la main. Accompagne bien les sauces.',
    price: 300,
    stock: 25,
    images: ['https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400'],
    category: 'attieke-manioc',
    shopId: '22',
    shopName: 'Tantie Adjoua Attiéké',
    status: 'published',
    createdAt: new Date('2023-11-10'),
    isPerishable: true,
    unit: 'piece',
  },
  {
    id: '212',
    title: 'Foutou banane',
    description: 'Foutou banane bien pilé. Prêt à consommer.',
    price: 500,
    stock: 20,
    images: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'],
    category: 'attieke-manioc',
    shopId: '22',
    shopName: 'Tantie Adjoua Attiéké',
    status: 'published',
    createdAt: new Date('2023-11-10'),
    isPerishable: true,
    unit: 'piece',
  },
  {
    id: '213',
    title: 'Gari',
    description: 'Gari de qualité pour votre petit déjeuner ou accompagnement.',
    price: 1000,
    stock: 40,
    images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'],
    category: 'attieke-manioc',
    shopId: '22',
    shopName: 'Tantie Adjoua Attiéké',
    status: 'published',
    createdAt: new Date('2023-11-10'),
    isPerishable: false,
    unit: 'kg',
  },
  // === CÉRÉALES & VIVRIERS ===
  {
    id: '220',
    title: 'Riz local de Bouaké',
    description: 'Riz cultivé localement à Bouaké. 100% ivoirien, soutien aux producteurs locaux.',
    price: 800,
    stock: 100,
    images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'],
    category: 'cereales-vivriers',
    shopId: '23',
    shopName: 'Coopérative Riz du Centre',
    status: 'published',
    createdAt: new Date('2023-11-10'),
    isPerishable: false,
    unit: 'kg',
  },
  {
    id: '221',
    title: 'Banane plantain',
    description: 'Bananes plantain mûres ou vertes selon votre choix. Alloco ou foutou !',
    price: 1000,
    stock: 60,
    images: ['https://images.unsplash.com/photo-1528825871115-3581a5387919?w=400'],
    category: 'cereales-vivriers',
    shopId: '24',
    shopName: 'Yao Vivriers',
    status: 'published',
    createdAt: new Date('2023-11-10'),
    isPerishable: true,
    unit: 'piece',
  },
  {
    id: '222',
    title: 'Igname',
    description: 'Igname de Bondoukou. Chair blanche et farineuse.',
    price: 500,
    stock: 50,
    images: ['https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=400'],
    category: 'cereales-vivriers',
    shopId: '24',
    shopName: 'Yao Vivriers',
    status: 'published',
    createdAt: new Date('2023-11-10'),
    isPerishable: true,
    unit: 'kg',
  },
  {
    id: '223',
    title: 'Maïs frais',
    description: 'Épis de maïs frais. À griller ou à bouillir.',
    price: 100,
    stock: 100,
    images: ['https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400'],
    category: 'cereales-vivriers',
    shopId: '24',
    shopName: 'Yao Vivriers',
    status: 'published',
    createdAt: new Date('2023-11-10'),
    isPerishable: true,
    unit: 'piece',
  },
  // === ÉPICES & CONDIMENTS ===
  {
    id: '230',
    title: 'Huile de palme',
    description: 'Huile de palme rouge artisanale. Pour vos sauces traditionnelles.',
    price: 1500,
    stock: 30,
    images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400'],
    category: 'epices-condiments',
    shopId: '25',
    shopName: 'Épices du Terroir',
    status: 'published',
    createdAt: new Date('2023-11-10'),
    isPerishable: false,
    unit: 'l',
  },
  {
    id: '231',
    title: 'Soumbala',
    description: 'Soumbala traditionnel pour donner du goût à vos plats.',
    price: 500,
    stock: 45,
    images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400'],
    category: 'epices-condiments',
    shopId: '25',
    shopName: 'Épices du Terroir',
    status: 'published',
    createdAt: new Date('2023-11-10'),
    isPerishable: false,
    unit: 'piece',
  },
  {
    id: '232',
    title: 'Pâte d\'arachide',
    description: 'Pâte d\'arachide fraîche moulue. Pour sauce arachide onctueuse.',
    price: 1000,
    stock: 25,
    images: ['https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400'],
    category: 'epices-condiments',
    shopId: '25',
    shopName: 'Épices du Terroir',
    status: 'published',
    createdAt: new Date('2023-11-10'),
    isPerishable: false,
    unit: 'kg',
  },
  // === POISSONS & VIANDES ===
  {
    id: '240',
    title: 'Poisson fumé (Carpe)',
    description: 'Carpe fumée traditionnellement. Idéale pour les sauces.',
    price: 2500,
    stock: 20,
    images: ['https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400'],
    category: 'poissons-viandes',
    shopId: '26',
    shopName: 'Mareyeuse Awa',
    status: 'published',
    createdAt: new Date('2023-11-10'),
    isPerishable: true,
    unit: 'piece',
  },
  {
    id: '241',
    title: 'Poulet bicyclette',
    description: 'Poulet fermier local, élevé en liberté. Chair ferme et savoureuse.',
    price: 4500,
    stock: 15,
    images: ['https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400'],
    category: 'poissons-viandes',
    shopId: '27',
    shopName: 'Ferme de Bingerville',
    status: 'published',
    createdAt: new Date('2023-11-10'),
    isPerishable: true,
    unit: 'piece',
  },
  {
    id: '242',
    title: 'Escargots frais',
    description: 'Escargots frais du village. Pour sauce kopé authentique.',
    price: 2000,
    stock: 25,
    images: ['https://images.unsplash.com/photo-1592491128653-3bf59547c2e7?w=400'],
    category: 'poissons-viandes',
    shopId: '27',
    shopName: 'Ferme de Bingerville',
    status: 'published',
    createdAt: new Date('2023-11-10'),
    isPerishable: true,
    unit: 'piece',
  },
  // === PRODUITS EXISTANTS ===
  {
    id: '1',
    title: 'Montre Élégance',
    description: 'Une montre élégante pour toutes les occasions.',
    price: 25000,
    stock: 15,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'],
    category: 'mode',
    shopId: '1',
    shopName: 'Boutique Chrono',
    status: 'published',
    createdAt: new Date('2023-10-01'),
  },
  {
    id: '2',
    title: 'Baskets de Sport',
    description: 'Baskets confortables pour vos activités sportives.',
    price: 35000,
    stock: 20,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'],
    category: 'sport',
    shopId: '2',
    shopName: 'Sportif Pro',
    variants: [
      { type: 'size', options: ['38', '39', '40', '41', '42', '43'] },
      { type: 'color', options: ['Rouge', 'Noir', 'Blanc'] },
    ],
    status: 'published',
    createdAt: new Date('2023-10-05'),
  },
  {
    id: '3',
    title: "Parfum 'Désir'",
    description: 'Un parfum envoûtant aux notes florales.',
    price: 18500,
    stock: 30,
    images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=400'],
    category: 'beaute',
    shopId: '3',
    shopName: 'Senteurs Divines',
    status: 'published',
    createdAt: new Date('2023-10-08'),
  },
  {
    id: '4',
    title: 'Casque Audio Sans Fil',
    description: 'Plongez dans une expérience sonore immersive avec notre casque audio professionnel. Conçu pour les audiophiles et les créateurs, il offre une clarté sonore exceptionnelle, des basses profondes et un confort inégalé pour de longues sessions d\'écoute.',
    price: 42000,
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400',
      'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=400',
    ],
    category: 'electronique',
    shopId: '4',
    shopName: 'TechZone',
    variants: [
      { type: 'color', options: ['Noir Onyx', 'Blanc', 'Rose Gold'] },
    ],
    status: 'published',
    createdAt: new Date('2023-10-10'),
  },
  {
    id: '5',
    title: 'Sac à Main en Cuir',
    description: 'Sac à main en cuir véritable, fait main.',
    price: 29900,
    stock: 8,
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400'],
    category: 'mode',
    shopId: '5',
    shopName: 'Marocana',
    variants: [
      { type: 'color', options: ['Marron', 'Noir', 'Camel'] },
    ],
    status: 'published',
    createdAt: new Date('2023-10-12'),
  },
  {
    id: '6',
    title: 'Set Soin Visage',
    description: 'Set complet pour le soin du visage.',
    price: 15000,
    stock: 25,
    images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'],
    category: 'beaute',
    shopId: '6',
    shopName: 'Peau Douce',
    status: 'published',
    createdAt: new Date('2023-10-15'),
  },
  {
    id: '7',
    title: 'Écouteurs Sans Fil',
    description: 'Écouteurs sans fil avec réduction de bruit.',
    price: 25000,
    stock: 18,
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400'],
    category: 'electronique',
    shopId: '4',
    shopName: 'Audio Tech',
    status: 'published',
    createdAt: new Date('2023-10-18'),
  },
  {
    id: '8',
    title: 'Casque Fashion Rose',
    description: 'Casque tendance aux couleurs vives.',
    price: 30000,
    stock: 10,
    images: ['https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400'],
    category: 'electronique',
    shopId: '7',
    shopName: 'StyleSound',
    status: 'published',
    createdAt: new Date('2023-10-20'),
  },
  // Produits Alimentaires
  {
    id: '9',
    title: 'Attiéké Frais',
    description: 'Attiéké traditionnel fait maison, accompagnement parfait pour vos plats.',
    price: 500,
    stock: 50,
    images: ['https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400'],
    category: 'alimentation',
    shopId: '8',
    shopName: 'Maman Adjoua',
    status: 'published',
    createdAt: new Date('2023-10-22'),
    isPerishable: true,
    unit: 'kg',
  },
  {
    id: '10',
    title: 'Poulet Braisé Complet',
    description: 'Poulet braisé avec attiéké et alloco. Portion généreuse pour 1 personne.',
    price: 3500,
    stock: 20,
    images: ['https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&h=400&fit=crop'],
    category: 'restaurants',
    shopId: '9',
    shopName: 'Chez Tantie Rose',
    status: 'published',
    createdAt: new Date('2023-10-23'),
    isPerishable: true,
    unit: 'piece',
  },
  {
    id: '11',
    title: 'Alloco (Bananes Plantain)',
    description: 'Alloco croustillant fraîchement préparé.',
    price: 1000,
    stock: 30,
    images: ['https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400'],
    category: 'alimentation',
    shopId: '8',
    shopName: 'Maman Adjoua',
    status: 'published',
    createdAt: new Date('2023-10-24'),
    isPerishable: true,
    unit: 'piece',
  },
  {
    id: '12',
    title: 'Jus de Bissap Frais',
    description: 'Jus de bissap naturel fait maison, 1 litre.',
    price: 1500,
    stock: 40,
    images: ['https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400'],
    category: 'boissons',
    shopId: '10',
    shopName: 'Délices d\'Afrique',
    status: 'published',
    createdAt: new Date('2023-10-25'),
    isPerishable: true,
    unit: 'l',
  },
  {
    id: '13',
    title: 'Garba Thon',
    description: 'Garba au thon frais avec piment et oignon.',
    price: 1500,
    stock: 25,
    images: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop'],
    category: 'restaurants',
    shopId: '9',
    shopName: 'Chez Tantie Rose',
    status: 'published',
    createdAt: new Date('2023-10-26'),
    isPerishable: true,
    unit: 'piece',
  },
  {
    id: '101',
    title: 'Foutou Sauce Graine',
    description: 'Délicieux foutou banane avec sauce graine et viande. Plat traditionnel ivoirien.',
    price: 2500,
    stock: 15,
    images: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop'],
    category: 'restaurants',
    shopId: '9',
    shopName: 'Chez Tantie Rose',
    status: 'published',
    createdAt: new Date('2023-11-01'),
    isPerishable: true,
    unit: 'piece',
  },
  {
    id: '102',
    title: 'Attiéké Poisson Braisé',
    description: 'Attiéké frais accompagné de poisson braisé, piment et oignons.',
    price: 3000,
    stock: 20,
    images: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop'],
    category: 'restaurants',
    shopId: '9',
    shopName: 'Chez Tantie Rose',
    status: 'published',
    createdAt: new Date('2023-11-02'),
    isPerishable: true,
    unit: 'piece',
  },
  {
    id: '103',
    title: 'Riz Sauce Arachide',
    description: 'Riz blanc avec sauce arachide et poulet. Portion copieuse.',
    price: 2000,
    stock: 25,
    images: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop'],
    category: 'restaurants',
    shopId: '13',
    shopName: 'Restaurant Le Baobab',
    status: 'published',
    createdAt: new Date('2023-11-03'),
    isPerishable: true,
    unit: 'piece',
  },
  {
    id: '104',
    title: 'Kedjenou de Poulet',
    description: 'Kedjenou traditionnel au poulet fermier cuit à l\'étouffée.',
    price: 4500,
    stock: 10,
    images: ['https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&h=400&fit=crop'],
    category: 'restaurants',
    shopId: '13',
    shopName: 'Restaurant Le Baobab',
    status: 'published',
    createdAt: new Date('2023-11-04'),
    isPerishable: true,
    unit: 'piece',
  },
  {
    id: '105',
    title: 'Placali Sauce Kopé',
    description: 'Placali moelleux avec sauce kopé aux escargots.',
    price: 3500,
    stock: 12,
    images: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop'],
    category: 'restaurants',
    shopId: '9',
    shopName: 'Chez Tantie Rose',
    status: 'published',
    createdAt: new Date('2023-11-05'),
    isPerishable: true,
    unit: 'piece',
  },
  {
    id: '106',
    title: 'Thiéboudiène',
    description: 'Riz au poisson à la sénégalaise. Généreux en légumes et épices.',
    price: 3000,
    stock: 18,
    images: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop'],
    category: 'restaurants',
    shopId: '14',
    shopName: 'Saveurs du Sahel',
    status: 'published',
    createdAt: new Date('2023-11-06'),
    isPerishable: true,
    unit: 'piece',
  },
  {
    id: '107',
    title: 'Brochettes de Boeuf',
    description: 'Brochettes de boeuf grillées au charbon, servies avec oignons et piment.',
    price: 2500,
    stock: 30,
    images: ['https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=400&fit=crop'],
    category: 'restaurants',
    shopId: '15',
    shopName: 'Grill Master',
    status: 'published',
    createdAt: new Date('2023-11-07'),
    isPerishable: true,
    unit: 'piece',
  },
  {
    id: '14',
    title: 'Pain Baguette',
    description: 'Baguette de pain frais du jour.',
    price: 200,
    stock: 100,
    images: ['https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400'],
    category: 'boulangerie',
    shopId: '11',
    shopName: 'Boulangerie du Quartier',
    status: 'published',
    createdAt: new Date('2023-10-27'),
    isPerishable: true,
    unit: 'piece',
  },
  {
    id: '15',
    title: 'Mangues Kent',
    description: 'Mangues Kent mûres et sucrées. Prix au kilo.',
    price: 2000,
    stock: 60,
    images: ['https://images.unsplash.com/photo-1553279768-865429fa0078?w=400'],
    category: 'alimentation',
    shopId: '12',
    shopName: 'Fruits & Légumes Bio',
    status: 'published',
    createdAt: new Date('2023-10-28'),
    isPerishable: true,
    unit: 'kg',
  },
  {
    id: '16',
    title: 'Riz Basmati 5kg',
    description: 'Riz basmati de qualité premium, sac de 5kg.',
    price: 8500,
    stock: 45,
    images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'],
    category: 'epicerie',
    shopId: '13',
    shopName: 'Super Épicerie',
    status: 'published',
    createdAt: new Date('2023-10-29'),
    unit: 'lot',
  },
];

// Boutiques de démonstration
export const shops: Shop[] = [
  {
    id: '1',
    name: 'Ma Boutique Chic',
    description: 'Vêtements et accessoires faits main.',
    logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200',
    phone: '+225 07 12 34 56',
    address: 'Abidjan, Cocody',
    sellerId: '2',
    createdAt: new Date('2023-01-15'),
    totalProducts: 124,
    monthlySales: 1250000,
    rating: 4.7,
    deliveryOptions: {
      pickup: true,
      delivery: true,
      deliveryFee: 1000,
      freeDeliveryMinimum: 25000,
      deliveryZones: ['Cocody', 'Plateau', 'Marcory'],
    },
  },
  {
    id: '8',
    name: 'Maman Adjoua',
    description: 'Spécialités ivoiriennes traditionnelles.',
    logo: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200',
    phone: '+225 05 11 22 33',
    address: 'Abidjan, Yopougon',
    sellerId: '3',
    createdAt: new Date('2023-03-10'),
    totalProducts: 15,
    monthlySales: 450000,
    rating: 4.9,
    deliveryOptions: {
      pickup: true,
      delivery: true,
      deliveryFee: 500,
      deliveryZones: ['Yopougon', 'Adjamé', 'Abobo'],
    },
  },
  {
    id: '9',
    name: 'Chez Tantie Rose',
    description: 'Restaurant - Poulet braisé, garba, et plus.',
    logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200',
    phone: '+225 07 44 55 66',
    address: 'Abidjan, Marcory',
    sellerId: '4',
    createdAt: new Date('2023-04-20'),
    totalProducts: 25,
    monthlySales: 890000,
    rating: 4.8,
    deliveryOptions: {
      pickup: true,
      delivery: true,
      deliveryFee: 1000,
      freeDeliveryMinimum: 10000,
      deliveryZones: ['Marcory', 'Treichville', 'Koumassi', 'Port-Bouët'],
    },
  },
  {
    id: '10',
    name: 'Délices d\'Afrique',
    description: 'Jus naturels et boissons rafraîchissantes.',
    logo: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200',
    phone: '+225 01 77 88 99',
    address: 'Abidjan, Plateau',
    sellerId: '5',
    createdAt: new Date('2023-05-15'),
    totalProducts: 20,
    monthlySales: 320000,
    rating: 4.6,
    deliveryOptions: {
      pickup: true,
      delivery: true,
      deliveryFee: 500,
      deliveryZones: ['Plateau', 'Cocody', 'Adjamé'],
    },
  },
  {
    id: '11',
    name: 'Boulangerie du Quartier',
    description: 'Pain frais et pâtisseries tous les jours.',
    logo: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200',
    phone: '+225 05 22 33 44',
    address: 'Abidjan, Cocody Riviera',
    sellerId: '6',
    createdAt: new Date('2023-02-01'),
    totalProducts: 35,
    monthlySales: 780000,
    rating: 4.7,
    deliveryOptions: {
      pickup: true,
      delivery: true,
      deliveryFee: 500,
      deliveryZones: ['Cocody'],
    },
  },
  {
    id: '12',
    name: 'Fruits & Légumes Bio',
    description: 'Fruits et légumes frais du producteur.',
    logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200',
    phone: '+225 07 55 66 77',
    address: 'Abidjan, Abobo',
    sellerId: '7',
    createdAt: new Date('2023-06-10'),
    totalProducts: 45,
    monthlySales: 520000,
    rating: 4.5,
    deliveryOptions: {
      pickup: true,
      delivery: true,
      deliveryFee: 1500,
      freeDeliveryMinimum: 15000,
      deliveryZones: ['Abobo', 'Adjamé', 'Yopougon', 'Cocody'],
    },
  },
  {
    id: '13',
    name: 'Super Épicerie',
    description: 'Tous vos produits du quotidien.',
    logo: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=200',
    phone: '+225 01 88 99 00',
    address: 'Abidjan, Adjamé',
    sellerId: '8',
    createdAt: new Date('2023-01-20'),
    totalProducts: 200,
    monthlySales: 1500000,
    rating: 4.4,
    deliveryOptions: {
      pickup: true,
      delivery: true,
      deliveryFee: 1000,
      freeDeliveryMinimum: 20000,
      deliveryZones: ['Adjamé', 'Plateau', 'Abobo', 'Yopougon'],
    },
  },
];

// Commandes de démonstration pour le buyer
export const buyerOrders = [
  {
    id: '1',
    orderNumber: '#30542',
    items: [
      { name: 'T-shirt Premium', quantity: 2, price: 12500 },
      { name: 'Pantalon Bleu', quantity: 1, price: 25000 }
    ],
    total: 50000,
    status: 'delivered' as const,
    customerName: 'Amara Koné',
    customerPhone: '+225 07 12 34 56',
    customerAddress: 'Abidjan, Cocody',
    paymentMethod: 'mobile_money' as const,
    shopId: '1',
    shopName: 'Boutique Chic',
    createdAt: new Date('2023-10-15'),
    updatedAt: new Date('2023-10-18'),
  },
  {
    id: '2',
    orderNumber: '#30511',
    items: [
      { name: 'Laptop', quantity: 1, price: 150000 }
    ],
    total: 150000,
    status: 'in_progress' as const,
    customerName: 'Amara Koné',
    customerPhone: '+225 07 12 34 56',
    customerAddress: 'Abidjan, Cocody',
    paymentMethod: 'cash' as const,
    shopId: '4',
    shopName: 'Tech Zone',
    createdAt: new Date('2023-10-12'),
    updatedAt: new Date('2023-10-12'),
  },
  {
    id: '3',
    orderNumber: '#30498',
    items: [
      { name: 'Robe Africaine', quantity: 1, price: 12500 }
    ],
    total: 12500,
    status: 'pending' as const,
    customerName: 'Amara Koné',
    customerPhone: '+225 07 12 34 56',
    customerAddress: 'Abidjan, Cocody',
    paymentMethod: 'mobile_money' as const,
    shopId: '5',
    shopName: 'La Maison du Style',
    createdAt: new Date('2023-10-10'),
    updatedAt: new Date('2023-10-10'),
  },
  {
    id: '4',
    orderNumber: '#30450',
    items: [
      { name: 'Panier Gourmet', quantity: 1, price: 35000 }
    ],
    total: 35000,
    status: 'cancelled' as const,
    customerName: 'Amara Koné',
    customerPhone: '+225 07 12 34 56',
    customerAddress: 'Abidjan, Cocody',
    paymentMethod: 'cash' as const,
    shopId: '6',
    shopName: 'Gourmet & Co',
    createdAt: new Date('2023-10-05'),
    updatedAt: new Date('2023-10-06'),
  },
];

// Produits du seller
export const sellerProducts: Product[] = [
  {
    id: '101',
    title: 'Chemise Rayée Bleue',
    description: 'Chemise élégante à rayures.',
    price: 15000,
    stock: 25,
    images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400'],
    category: 'mode',
    shopId: '1',
    shopName: 'Ma Boutique Chic',
    status: 'published',
    createdAt: new Date('2023-09-01'),
  },
  {
    id: '102',
    title: 'Sac à Main en Cuir',
    description: 'Sac à main en cuir véritable.',
    price: 35000,
    stock: 12,
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400'],
    category: 'mode',
    shopId: '1',
    shopName: 'Ma Boutique Chic',
    status: 'published',
    createdAt: new Date('2023-09-10'),
  },
  {
    id: '103',
    title: 'Bracelet Tissé Coloré',
    description: 'Bracelet artisanal fait main.',
    price: 5000,
    stock: 5,
    images: ['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400'],
    category: 'mode',
    shopId: '1',
    shopName: 'Ma Boutique Chic',
    status: 'low_stock',
    createdAt: new Date('2023-09-15'),
  },
  {
    id: '104',
    title: 'Trench Coat Classique',
    description: 'Trench coat intemporel.',
    price: 55000,
    stock: 18,
    images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400'],
    category: 'mode',
    shopId: '1',
    shopName: 'Ma Boutique Chic',
    status: 'draft',
    createdAt: new Date('2023-09-20'),
  },
];

// Livreurs de démonstration
export const drivers = [
  {
    id: 'D1',
    userId: 'U10',
    name: 'Kouadio Jean',
    phone: '+225 07 11 22 33',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    vehicleType: 'moto' as const,
    licensePlate: 'AB 1234 CI',
    isAvailable: true,
    currentLocation: { lat: 5.3600, lng: -4.0083 },
    rating: 4.8,
    totalDeliveries: 342,
    createdAt: new Date('2023-01-10'),
  },
  {
    id: 'D2',
    userId: 'U11',
    name: 'Traoré Moussa',
    phone: '+225 05 44 55 66',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    vehicleType: 'moto' as const,
    licensePlate: 'CD 5678 CI',
    isAvailable: true,
    currentLocation: { lat: 5.3470, lng: -4.0170 },
    rating: 4.6,
    totalDeliveries: 215,
    createdAt: new Date('2023-02-15'),
  },
  {
    id: 'D3',
    userId: 'U12',
    name: 'Bamba Lacina',
    phone: '+225 01 77 88 99',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    vehicleType: 'voiture' as const,
    licensePlate: 'EF 9012 CI',
    isAvailable: false,
    rating: 4.9,
    totalDeliveries: 523,
    createdAt: new Date('2022-11-20'),
  },
  {
    id: 'D4',
    userId: 'U13',
    name: 'Koné Fatou',
    phone: '+225 07 00 11 22',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    vehicleType: 'moto' as const,
    licensePlate: 'GH 3456 CI',
    isAvailable: true,
    currentLocation: { lat: 5.3200, lng: -3.9700 },
    rating: 4.7,
    totalDeliveries: 189,
    createdAt: new Date('2023-04-05'),
  },
];

// Zones de livraison disponibles
export const deliveryZones = [
  'Cocody',
  'Plateau',
  'Marcory',
  'Treichville',
  'Koumassi',
  'Port-Bouët',
  'Yopougon',
  'Abobo',
  'Adjamé',
  'Attécoubé',
  'Bingerville',
  'Grand-Bassam',
];

// Frais de livraison par zone (en FCFA)
export const deliveryFees: Record<string, number> = {
  'Cocody': 1000,
  'Plateau': 1000,
  'Marcory': 1000,
  'Treichville': 1000,
  'Koumassi': 1500,
  'Port-Bouët': 2000,
  'Yopougon': 1500,
  'Abobo': 1500,
  'Adjamé': 1000,
  'Attécoubé': 1500,
  'Bingerville': 2500,
  'Grand-Bassam': 3500,
};

// ============================================
// Configuration des frais Point Relais
// ============================================

// Frais fixes optionnels payés par le client pour le retrait en point relais (FCFA)
// Le client paie: prix du produit + relayCustomerFee
export const RELAY_CUSTOMER_FEE = 0; // Petit frais fixe facturé au client (optionnel)

// Tarifs payés par Jour Marché au livreur pour livrer au point relais (FCFA)
// Ces frais sont payés par Jour Marché, pas par le client
export interface RelayDriverFee {
  zone: string;
  baseFee: number;           // Tarif de base
  distanceRanges: {
    maxKm: number;           // Distance max en km
    fee: number;             // Tarif pour cette tranche
  }[];
  volumeBonus: {             // Bonus selon le volume
    small: number;           // Petit colis (< 2kg)
    medium: number;          // Moyen colis (2-5kg)
    large: number;           // Gros colis (> 5kg)
  };
}

export const relayDriverFees: RelayDriverFee[] = [
  {
    zone: 'Zone A', // Plateau, Cocody, Marcory
    baseFee: 500,
    distanceRanges: [
      { maxKm: 3, fee: 500 },
      { maxKm: 5, fee: 750 },
      { maxKm: 10, fee: 1000 },
    ],
    volumeBonus: { small: 0, medium: 100, large: 200 },
  },
  {
    zone: 'Zone B', // Treichville, Koumassi, Adjamé
    baseFee: 750,
    distanceRanges: [
      { maxKm: 3, fee: 750 },
      { maxKm: 5, fee: 1000 },
      { maxKm: 10, fee: 1250 },
    ],
    volumeBonus: { small: 0, medium: 100, large: 200 },
  },
  {
    zone: 'Zone C', // Yopougon, Abobo, Port-Bouët
    baseFee: 1000,
    distanceRanges: [
      { maxKm: 5, fee: 1000 },
      { maxKm: 10, fee: 1250 },
      { maxKm: 15, fee: 1500 },
    ],
    volumeBonus: { small: 0, medium: 150, large: 300 },
  },
];

// Mapping des communes vers les zones
export const communeToZone: Record<string, string> = {
  'Plateau': 'Zone A',
  'Cocody': 'Zone A',
  'Marcory': 'Zone A',
  'Treichville': 'Zone B',
  'Koumassi': 'Zone B',
  'Adjamé': 'Zone B',
  'Yopougon': 'Zone C',
  'Abobo': 'Zone C',
  'Port-Bouët': 'Zone C',
  'Attécoubé': 'Zone B',
  'Bingerville': 'Zone C',
  'Grand-Bassam': 'Zone C',
};

// Fonction utilitaire pour déterminer la taille du colis selon le poids
export function getPackageSize(weightGrams: number): 'small' | 'medium' | 'large' {
  const weightKg = weightGrams / 1000;
  if (weightKg < 2) return 'small';
  if (weightKg <= 5) return 'medium';
  return 'large';
}

// Fonction utilitaire pour calculer les frais livreur pour un point relais
// Calcul basé sur: le poids de l'article et le trajet (distance)
export function calculateRelayDriverFee(
  commune: string,
  distanceKm: number,
  weightGrams: number = 500 // Poids par défaut 500g
): number {
  const zone = communeToZone[commune] || 'Zone C';
  const zoneConfig = relayDriverFees.find(z => z.zone === zone) || relayDriverFees[2];
  
  // Déterminer la taille du colis selon le poids
  const packageSize = getPackageSize(weightGrams);
  
  // Trouver le tarif selon la distance
  let distanceFee = zoneConfig.baseFee;
  for (const range of zoneConfig.distanceRanges) {
    if (distanceKm <= range.maxKm) {
      distanceFee = range.fee;
      break;
    }
    distanceFee = range.fee; // Prendre le dernier si au-delà de toutes les tranches
  }
  
  // Ajouter le bonus volume
  const volumeBonus = zoneConfig.volumeBonus[packageSize];
  
  return distanceFee + volumeBonus;
}

// Points de relais avec informations de tarification
export interface RelayPoint {
  id: string;
  name: string;
  address: string;
  phone: string;
  city: string;
  commune: string;
  hours: string;
  distance: number;        // Distance en km
  customerFee: number;     // Frais payés par le client (optionnel, peut être 0)
  driverFee: number;       // Frais payés par Jour Marché au livreur
}

export const relayPoints: RelayPoint[] = [
  {
    id: 'relay_1',
    name: 'Point de Relais Marcory',
    address: '123 Avenue Giscard d\'Estaing, Marcory',
    phone: '+225 27 20 30 40 50',
    city: 'Abidjan',
    commune: 'Marcory',
    hours: 'Lun-Sam: 8h-18h, Dim: 9h-17h',
    distance: 2.3,
    customerFee: RELAY_CUSTOMER_FEE,
    driverFee: calculateRelayDriverFee('Marcory', 2.3),
  },
  {
    id: 'relay_2',
    name: 'Point de Relais Plateau',
    address: '456 Rue du Commerce, Plateau',
    phone: '+225 27 20 25 35 45',
    city: 'Abidjan',
    commune: 'Plateau',
    hours: 'Lun-Sam: 9h-19h',
    distance: 4.5,
    customerFee: RELAY_CUSTOMER_FEE,
    driverFee: calculateRelayDriverFee('Plateau', 4.5),
  },
  {
    id: 'relay_3',
    name: 'Point de Relais Cocody',
    address: '789 Boulevard de la Paix, Cocody',
    phone: '+225 27 20 35 45 55',
    city: 'Abidjan',
    commune: 'Cocody',
    hours: 'Lun-Dim: 8h-20h',
    distance: 5.8,
    customerFee: RELAY_CUSTOMER_FEE,
    driverFee: calculateRelayDriverFee('Cocody', 5.8),
  },
  {
    id: 'relay_4',
    name: 'Point de Relais Yopougon',
    address: '321 Rue Principale, Yopougon',
    phone: '+225 27 20 40 50 60',
    city: 'Abidjan',
    commune: 'Yopougon',
    hours: 'Lun-Sam: 8h-17h',
    distance: 8.2,
    customerFee: RELAY_CUSTOMER_FEE,
    driverFee: calculateRelayDriverFee('Yopougon', 8.2),
  },
  {
    id: 'relay_5',
    name: 'Point de Relais Abobo',
    address: '567 Avenue Principale, Abobo',
    phone: '+225 27 20 45 55 65',
    city: 'Abidjan',
    commune: 'Abobo',
    hours: 'Lun-Sam: 7h-18h',
    distance: 10.5,
    customerFee: RELAY_CUSTOMER_FEE,
    driverFee: calculateRelayDriverFee('Abobo', 10.5),
  },
  {
    id: 'relay_6',
    name: 'Point de Relais Koumassi',
    address: '890 Boulevard Principal, Koumassi',
    phone: '+225 27 20 50 60 70',
    city: 'Abidjan',
    commune: 'Koumassi',
    hours: 'Lun-Sam: 8h-19h',
    distance: 6.1,
    customerFee: RELAY_CUSTOMER_FEE,
    driverFee: calculateRelayDriverFee('Koumassi', 6.1),
  },
];
