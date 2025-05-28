// prisma/seed.mjs
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // Clear existing data
  await prisma.score.deleteMany({});
  await prisma.friendRequest.deleteMany({});
  await prisma.friend.deleteMany({});
  await prisma.player.deleteMany({});
  
  // Create sample players
  const saltRounds = 10;
  const password = await bcrypt.hash('password123', saltRounds);
  
  const players = [
    {
      name: 'JohnDoe',
      country: 'United States',
      gender: 'male',
      password
    },
    {
      name: 'JaneSmith',
      country: 'Canada',
      gender: 'female',
      password
    },
    {
      name: 'MusicMaster',
      country: 'United Kingdom',
      gender: 'male',
      password
    },
    {
      name: 'RhythmQueen',
      country: 'Australia',
      gender: 'female',
      password
    },
    {
      name: 'BeatBoxer',
      country: 'Germany',
      gender: 'male',
      password
    }
  ];
  
  const createdPlayers = [];
  
  for (const player of players) {
    const createdPlayer = await prisma.player.create({
      data: player
    });
    
    createdPlayers.push(createdPlayer);
    
    // Create some scores for each player
    const scoreValue = Math.floor(Math.random() * 500) + 500;
    
    await prisma.score.create({
      data: {
        value: scoreValue,
        playerId: createdPlayer.id
      }
    });
    
    // Add some additional scores with different values
    await prisma.score.create({
      data: {
        value: Math.floor(scoreValue * 0.8),
        playerId: createdPlayer.id
      }
    });
    
    await prisma.score.create({
      data: {
        value: Math.floor(scoreValue * 0.9),
        playerId: createdPlayer.id
      }
    });
    
    // Update player's score with the highest value
    await prisma.player.update({
      where: { id: createdPlayer.id },
      data: { score: scoreValue }
    });
  }
  
  // Create some friendships and friend requests
  // JohnDoe and JaneSmith are friends
  await prisma.friend.create({
    data: {
      user1Id: createdPlayers[0].id,
      user2Id: createdPlayers[1].id
    }
  });
  
  // MusicMaster sent a friend request to JohnDoe
  await prisma.friendRequest.create({
    data: {
      senderId: createdPlayers[2].id,
      receiverId: createdPlayers[0].id,
      status: 'pending'
    }
  });
  
  // RhythmQueen and BeatBoxer are friends
  await prisma.friend.create({
    data: {
      user1Id: createdPlayers[3].id,
      user2Id: createdPlayers[4].id
    }
  });
  
  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
