const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'l7wtqsmy',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-05-11',
  token: 'skBk67VkgahUyJY7kXRuCg555q30V74VzVLnGbP692KSCXYwmldbjjhN5m2cCuWow4hioMf71k0gQ1Lj5bXP0tVm7MvWwJ2DSKKqvZti5ov3HcdGwET2CdufnAsVHMFLaGGk0WbzPHGHViKs26qzVYzG0ogWJDSPe9GKtDzQhwAi7bokK1tD',
});

async function seed() {
  console.log('Seeding data to Sanity...');

  // 1. Global Settings
  const settings = {
    _type: 'settings',
    _id: 'settings',
    hotelName: 'SVS Grands — Lodge in Vadapalli',
    phoneNumber: '8341199779',
    email: 'svsgrands@gmail.com',
    whatsapp: 'https://wa.me/918341199779',
    address: 'Near Sri Venkateswara Swamy Temple, Vadapalli, Andhra Pradesh',
    googleMaps: 'https://goo.gl/maps/xyz',
    copyright: '© 2024 SVS Grands. All rights reserved.',
  };
  await client.createOrReplace(settings);
  console.log('Settings seeded.');

  // 2. Homepage
  const homepage = {
    _type: 'homepage',
    _id: 'homepage',
    heroHeading: 'A COZY FAMILY STAY',
    heroSubheading: 'NEAR KONASEEMA TIRUPATHI TEMPLE.',
    aboutContent: 'Located near the famous Sri Venkateswara Swamy Temple, Vadapalli, SVS Grands offers a peaceful and comfortable stay experience for pilgrims, families, and travelers. Designed with modern comfort and traditional hospitality, our rooms provide a relaxing atmosphere with convenient amenities, flexible stay options, and easy access to nearby spiritual destinations.',
  };
  await client.createOrReplace(homepage);
  console.log('Homepage seeded.');

  // 3. Rooms
  const rooms = [
    { id: 'STANDARD', name: 'Standard Room', price: 800, description: 'Comfortable rooms with modern amenities — WiFi, TV (Optional), hot water and room service.' },
    { id: 'CLASSIC', name: 'Classic Room', price: 1000, description: 'Climate-controlled rooms for a premium stay — all amenities plus air conditioning. TV (Optional).' },
    { id: 'DELUXE', name: 'Deluxe Room', price: 1500, description: 'Spacious ground floor rooms with a double bed, TV, and premium furnishings for ultimate comfort.' },
    { id: 'SUPERIOR', name: 'Superior Room', price: 1500, description: 'Elegant first-floor double bed rooms offering extra privacy, modern decor, and top-tier amenities.' },
    { id: 'FAMILY_COMFORT', name: 'Family Comfort Room', price: 1200, description: 'Perfect for families, these spacious first-floor rooms offer great value without compromising on comfort.' },
  ];

  for (const room of rooms) {
    await client.createOrReplace({
      _type: 'room',
      _id: `room-${room.id.toLowerCase()}`,
      name: room.name,
      slug: { _type: 'slug', current: room.id.toLowerCase() },
      price: room.price,
      shortDescription: room.description,
    });
  }
  console.log('Rooms seeded.');

  // 4. Places
  const places = [
    { id: 'vadapalli', name: 'వడపల్లి — Sri Venkateswara Swamy Temple', distance: 'Approx. 1 km', description: 'వడపల్లి is a famous spiritual destination known for the Sri Venkateswara Swamy Temple surrounded by peaceful Konaseema scenery.' },
    { id: 'ryali', name: 'ర్యాలి — Jaganmohini Kesava Swamy Temple', distance: 'Approx. 12 km', description: 'ర్యాలి is one of the most famous spiritual destinations near Vadapalli, known for the unique Jaganmohini Kesava Swamy Temple.' },
    { id: 'atreyapuram', name: 'ఆత్రేయపురం — Home of Pootharekulu', distance: 'Approx. 18 km', description: 'ఆత్రేయపురం is world-famous for traditional Andhra Pootharekulu sweets and beautiful Konaseema surroundings.' },
    { id: 'ravulapalem', name: 'రావులపాలెం — Gateway of Konaseema', distance: 'Approx. 15 km', description: 'రావులపాలెం is popularly called the Gateway of Konaseema because of its greenery, coconut plantations, and lively town atmosphere.' },
  ];

  for (const place of places) {
    await client.createOrReplace({
      _type: 'place',
      _id: `place-${place.id}`,
      name: place.name,
      slug: { _type: 'slug', current: place.id },
      distance: place.distance,
      description: place.description,
    });
  }
  console.log('Places seeded.');

  console.log('Seeding complete!');
}

seed().catch(console.error);
