const moviesData = [
  {
    title: 'Dune: Part Two',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.',
    genres: ['Sci-Fi', 'Adventure', 'Action'],
    languages: ['English', 'Hindi'],
    duration: 166,
    releaseDate: new Date('2024-03-01'),
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    rating: 8.8,
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem'],
    director: 'Denis Villeneuve',
    isActive: true
  },
  {
    title: 'Oppenheimer',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, exploring the profound moral dilemmas and political fallout that followed.',
    genres: ['Biography', 'Drama', 'History'],
    languages: ['English', 'Hindi'],
    duration: 180,
    releaseDate: new Date('2023-07-21'),
    posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
    rating: 8.9,
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.'],
    director: 'Christopher Nolan',
    isActive: true
  },
  {
    title: 'Interstellar',
    description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    languages: ['English'],
    duration: 169,
    releaseDate: new Date('2014-11-07'),
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    rating: 8.7,
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
    director: 'Christopher Nolan',
    isActive: true
  },
  {
    title: 'Spider-Man: Across the Spider-Verse',
    description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.',
    genres: ['Animation', 'Action', 'Adventure', 'Sci-Fi'],
    languages: ['English', 'Hindi', 'Spanish'],
    duration: 140,
    releaseDate: new Date('2023-06-02'),
    posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=cqGjhVJWtEg',
    rating: 8.7,
    cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac', 'Daniel Kaluuya'],
    director: 'Joaquim Dos Santos, Kemp Powers',
    isActive: true
  },
  {
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    genres: ['Action', 'Crime', 'Drama'],
    languages: ['English', 'Hindi'],
    duration: 152,
    releaseDate: new Date('2008-07-18'),
    posterUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
    rating: 9.0,
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Michael Caine'],
    director: 'Christopher Nolan',
    isActive: true
  },
  {
    title: 'Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the mission.',
    genres: ['Action', 'Sci-Fi', 'Thriller'],
    languages: ['English', 'Hindi'],
    duration: 148,
    releaseDate: new Date('2010-07-16'),
    posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    rating: 8.8,
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page', 'Tom Hardy'],
    director: 'Christopher Nolan',
    isActive: true
  },
  {
    title: 'Gladiator II',
    description: 'Years after witnessing the death of Maximus at the hands of his uncle, Lucius must enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome with an iron fist.',
    genres: ['Action', 'Adventure', 'Drama'],
    languages: ['English', 'Hindi'],
    duration: 148,
    releaseDate: new Date('2024-11-22'),
    posterUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=4rgYUipGJNo',
    rating: 8.4,
    cast: ['Paul Mescal', 'Pedro Pascal', 'Denzel Washington', 'Connie Nielsen'],
    director: 'Ridley Scott',
    isActive: true
  },
  {
    title: 'Avengers: Endgame',
    description: 'After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos\' actions and restore balance to the universe.',
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    languages: ['English', 'Hindi'],
    duration: 181,
    releaseDate: new Date('2019-04-26'),
    posterUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
    rating: 8.4,
    cast: ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo', 'Chris Hemsworth', 'Scarlett Johansson'],
    director: 'Anthony Russo, Joe Russo',
    isActive: true
  }
];

const theatresData = [
  {
    name: 'PVR ICON - Phoenix Palladium',
    city: 'Mumbai',
    address: 'High Street Phoenix, Senapati Bapat Marg, Lower Parel, Mumbai',
    facilities: ['Dolby Atmos', '4K Laser Projection', 'Gourmet Cafe', 'Recliner Lounges', 'Valet Parking'],
    screens: [
      {
        screenNumber: 1,
        name: 'Screen 1 (IMAX with Laser)',
        totalSeats: 60,
        tiers: [
          { tierName: 'VIP', rows: ['A'], cols: 10, priceMultiplier: 1.6 },
          { tierName: 'Premium', rows: ['B', 'C', 'D'], cols: 10, priceMultiplier: 1.3 },
          { tierName: 'Standard', rows: ['E', 'F'], cols: 10, priceMultiplier: 1.0 }
        ]
      },
      {
        screenNumber: 2,
        name: 'Screen 2 (Dolby 7.1)',
        totalSeats: 60,
        tiers: [
          { tierName: 'VIP', rows: ['A'], cols: 10, priceMultiplier: 1.5 },
          { tierName: 'Premium', rows: ['B', 'C', 'D'], cols: 10, priceMultiplier: 1.2 },
          { tierName: 'Standard', rows: ['E', 'F'], cols: 10, priceMultiplier: 1.0 }
        ]
      }
    ]
  },
  {
    name: 'INOX Megaplex - Inorbit Mall',
    city: 'Mumbai',
    address: 'Inorbit Mall, New Link Rd, Malad West, Mumbai',
    facilities: ['Dolby Atmos', 'MX4D Motion', 'Insignia Dining', 'Wheelchair Access'],
    screens: [
      {
        screenNumber: 1,
        name: 'Insignia Screen 1',
        totalSeats: 60,
        tiers: [
          { tierName: 'VIP', rows: ['A'], cols: 10, priceMultiplier: 1.7 },
          { tierName: 'Premium', rows: ['B', 'C', 'D'], cols: 10, priceMultiplier: 1.35 },
          { tierName: 'Standard', rows: ['E', 'F'], cols: 10, priceMultiplier: 1.0 }
        ]
      }
    ]
  },
  {
    name: 'Cinepolis Grand - Viviana Mall',
    city: 'Thane',
    address: 'Eastern Express Highway, Thane West, Maharashtra',
    facilities: ['Dolby Atmos', 'RealD 3D', 'Coffee Bar', 'Parking'],
    screens: [
      {
        screenNumber: 1,
        name: 'Auditorium 1',
        totalSeats: 60,
        tiers: [
          { tierName: 'VIP', rows: ['A'], cols: 10, priceMultiplier: 1.5 },
          { tierName: 'Premium', rows: ['B', 'C', 'D'], cols: 10, priceMultiplier: 1.25 },
          { tierName: 'Standard', rows: ['E', 'F'], cols: 10, priceMultiplier: 1.0 }
        ]
      }
    ]
  },
  {
    name: 'PVR Directors Cut - Ambience Mall',
    city: 'Delhi',
    address: 'Ambience Mall, Nelson Mandela Marg, Vasant Kunj, New Delhi',
    facilities: ['Platinum Class', 'Dolby Atmos', 'Chef Concierge', 'Cocktail Lounge'],
    screens: [
      {
        screenNumber: 1,
        name: 'Director Screen 1',
        totalSeats: 60,
        tiers: [
          { tierName: 'VIP', rows: ['A'], cols: 10, priceMultiplier: 1.8 },
          { tierName: 'Premium', rows: ['B', 'C', 'D'], cols: 10, priceMultiplier: 1.4 },
          { tierName: 'Standard', rows: ['E', 'F'], cols: 10, priceMultiplier: 1.0 }
        ]
      }
    ]
  }
];

module.exports = { moviesData, theatresData };
