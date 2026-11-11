# Ollie parts 7–12: the plan

Asked for by the owner on 11 Nov 2026. Parts 7 to 11 are built and recorded (11 Nov 2026); every new sentence is recorded
in Ollie's voice (`en-US-AvaNeural`) before a part is built.

## What they are

A second course beside the first one, not a harder one. Part 7 is at the level of part 1, part 8 at the
level of part 2, and so on up to part 12 at the level of part 6. A child who has finished part 1 gets
30 fresh lessons at the same level before or after moving up.

Same shape as parts 1–6: 5 worlds × 6 lessons; a lesson is 6 words, a conversation of 4 rows,
a listening text with 3 questions, a reading text with 3 questions, and a game. Same engine, so all
19 games, the wardrobe, the library and the rest work with no new code.

## Rules for the content

- No music, songs, singing, dancing or instruments anywhere, including wrong answers.
- Kid-friendly, Saudi and Gulf settings where natural, no real brands.
- Pictures: one emoji a word, from 2021 or earlier, no two words of a lesson with the same picture.
- Texts: part 7 about 5 short sentences, growing to about 7 longer ones in part 12. Avoid quotations
  cut across sentences (the sentence games skip them).

## Files

`9.html` is taken by another page of the owner's, so "part N is file N+1" stops at part 6.
Parts 7–12 are `ollie-7.html` … `ollie-12.html`, built from `src/ollie/data/part7.js` … `part12.js`.
`src/build.py` and the "parts" links at the bottom of each page need that mapping.

## Recording

About 8,000 new lines, close to the free month of Azure (500,000 characters), at about 20 a minute:
several hours, so record part by part. Order: write `part7.js`, add its lines to `ollie-lines.json`,
run `tools/english-voices.py`, make `ollie/voices/part7.json`, build, `ollie-check`, `ollie-play`, publish.

## Worlds and lessons

### Part 7 (level of part 1)
1. My Room: My Bed · Toys on the Shelf · The Window · Tidy Up · Under the Bed · Good Night
2. At the Park: The Slide · Ducks in the Pond · A Picnic · Kites · The Big Tree · Time to Go Home
3. In the Kitchen: Breakfast · Hot and Cold · Fruit Salad · Setting the Table · Washing Up · A Cake for Mum
4. Little Animals: The Kitten · The Ant · The Rabbit · The Fish Bowl · The Baby Camel · The Lost Chick
5. Out and About: The Bus · The Shop · The Mosque · The Doctor · The Beach · Grandma's House

### Part 8 (level of part 2)
1. Weather and Seasons: A Rainy Day · Summer Heat · Wind and Sand · Winter Clothes · Clouds · The Rainbow
2. Sports Day: The Race · Team Colours · Swimming Lesson · The Goal · Winners and Friends · Warm Up
3. Jobs People Do: The Baker · The Pilot · The Nurse · The Farmer · The Builder · The Firefighter
4. Last Weekend: A Trip to the Farm · The Broken Bike · A Visit to Grandpa · Camping · Lost and Found · A Surprise
5. Helping at Home: Shopping List · Watering the Garden · Fixing a Toy · Looking After Baby · Cooking Together · A Clean House

### Part 9 (level of part 3)
1. The Sea: Fishing Boats · Dolphins · The Lighthouse · Shells and Sand · Under the Water · A Storm at Sea
2. Space: The Moon · The Planets · An Astronaut's Day · Stars at Night · Rockets · Life on the Space Station
3. Comparing Things: Faster and Slower · The Tallest Tower · Old and New · Cheaper or Better · Far and Near · The Best Day
4. Machines Around Us: The Lift · The Fridge · Traffic Lights · The Washing Machine · The Crane · Robots at Work
5. Stories from the Desert: The Well · The Caravan · The Falcon · The Night Sky · The Oasis · The Clever Shepherd

### Part 10 (level of part 4)
1. Journeys: At the Airport · A Train Across the Desert · Lost in a New City · The Map · A Letter Home · Coming Back
2. The Body at Work: Sleep · Bones and Muscles · The Five Senses · Food as Fuel · Germs · First Aid
3. If and When: If I Were a Bird · When I Grow Up · If It Never Rained · Before You Travel · Unless We Hurry · What Would You Do?
4. Mysteries: The Missing Key · Footprints · The Locked Room · A Strange Message · The Old Map · Solved!
5. Our Planet: Forests · Rivers · Deserts on the Move · Animals in Danger · Clean Energy · What We Can Do

### Part 11 (level of part 5)
1. Great Ideas: The Wheel · Paper · The Compass · Glasses · The Printing Press · The Internet
2. Speaking Up: Giving a Talk · Asking Good Questions · Agreeing Politely · Telling a Story Well · Explaining a Plan · Saying Sorry
3. Money Sense: Saving for Something · A Fair Price · Borrowing and Lending · A Small Business · Giving · Planning a Budget
4. People Who Changed Things: Ibn Sina · Al-Khwarizmi · Ibn Battuta · Fatima al-Fihri · Marie Curie · Wangari Maathai
5. Thinking Clearly: Fact or Opinion · Cause and Effect · Spotting a Trick · Changing Your Mind · Two Sides · A Good Decision

### Part 12 (level of part 6)
1. How Science Works: Asking a Question · A Fair Test · Reading a Graph · When Results Surprise · Sharing Findings · Science and Doubt
2. Cities of the Future: Water in the Desert · Homes That Stay Cool · Moving Without Cars · Farming Indoors · Waste as a Resource · A City for Everyone
3. Language and Meaning: Proverbs · Translation · Words That Travel · Metaphor · Persuasion · Saying It Simply
4. Working Together: Leading a Team · Listening · Dividing the Work · Solving a Disagreement · Deadlines · Celebrating Success
5. Big Questions: What Is Fair? · What Makes a Friend? · Humans and Machines · Privacy · Our Duty to the Future · A Life Well Lived
