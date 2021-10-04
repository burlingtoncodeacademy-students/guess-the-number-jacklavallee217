const { Console } = require("console");
const readline = require("readline");
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}

gameSetUp();

async function gameSetUp() {
  // Prompts player which game they want to play
  let gamePrompt = await ask(
    "\nHello would you like to guess my number (Enter '1'), Or should I guess yours (Enter '2')?\n"
  );
  gamePrompt = parseInt(gamePrompt);

  // Input Hygiene
  while (typeof gamePrompt == "number") {
    // You guesses
    if (gamePrompt === 1) {
      reverseStart();
      break;
    }
    //computer guesses
    else if (gamePrompt === 2) {
      start();
      break;
    }
    // Reprompt, needs to be 1 or 2
    else {
      gamePrompt = await ask(
        "\nOops! that wasn't a '1' or '2'. Please Enter one of those.\n"
      );
      gamePrompt = parseInt(gamePrompt);
    }
  }
}

async function rematch() {
  // Rematch prompt
  let rematchPrompt = await ask("\nWould you like to play again? (Y/N)\n");
  // Formats string
  rematchPrompt = rematchPrompt.toLowerCase().trim();

  while (typeof rematchPrompt == "string") {
    // Continues game
    if (rematchPrompt === "y") {
      gameSetUp();
      break;
    }
    // Ends Program
    else if (rematchPrompt === "n") {
      console.log("\n\nggs\n\n");
      process.exit();
    }
    // Reprompt, needs to be
    else {
      rematchPrompt = await ask(
        "\nOops! Not (Y/N). Would you like to play again? (Y/N)\n"
      );
      rematchPrompt = rematchPrompt.toLowerCase().trim();
    }
  }
}

async function start() {
  console.log(
    "\n\nLet's play a game where you (human) make up a number and I (computer) try to guess it."
  );

  // Lowest possible guess, casted to number
  let min = await ask("\nWhat is your minimum number?\n");
  while (min < 1) {
    min = await ask("\nWhat is your minimum number?\n");
  }
  min = parseInt(min);

  // Highest possible guess, casted to number
  let max = await ask("\nWhat is your maximum number?\n");
  while (max <= min) {
    max = await ask("\nWhat is your maximum number?\n");
  }
  max = parseInt(max);

  // Player's number choice
  let secretNumber = await ask(
    "\nWhat is your secret number?\nI won't peek, I promise...\n"
  );

  // Number of guesses
  let guesses = 0;

  // If the entry is not within the specified range
  if (secretNumber < min || secretNumber > max) {
    secretNumber = await ask(
      "\nOops! That is not within the range you specified, try again...\n"
    );
  }

  console.log(
    "\nYou entered: " + secretNumber + "\nPress any key to continue...\n"
  );

  // Function for averaging min and max
  function average(min, max) {
    let answer = ((max - min) / 2) + min;
    answer = Math.floor(answer);
    return answer;
  }

  // Prompts a guess
  process.stdin.once("data", async function guessNumber() {
    guesses++;
    let yesNo = await ask(`Is ${average(min, max)} your number? (Y/N)\n`);
    
    while (yesNo.toLowerCase() === "n") {
      // Asks if it is higher or lower
      let hiLow = await ask(
        `\nIs it Higher (H) or Lower (L) than ${average(min, max)}\n`
      );

      // If higher: guess becomes minimum answer, next guess is average between present guess and maximum answer
      if (hiLow.toLowerCase() === "h") {
        console.log(secretNumber);
        console.log(max);
        console.log(min);
        if (secretNumber == max) {
          console.log("\nYou're not telling the truth...\n");
          yesNo = "y";
          break;
        }
        min = secretNumber;
      }
      // If lower: guess becomes maximum answer, next guess is average between present guess and minimum answer
      else if (hiLow.toLowerCase() === "l") {
        console.log(secretNumber);
        console.log(max);
        console.log(min);
        if (secretNumber == min) {
          console.log("\nYou're not telling the truth...\n");
          yesNo = "y";
          break;
        }
        max = secretNumber;
      }
      // Was not an H or L
      else {
        console.log("That was not an H or an L...");
      }

      guesses++;

      // Ask if it is the number again
      yesNo = await ask(`\nIs ${average(min, max)} your number? (Y/N)\n`);
    }

    // You win wooooo!
    if (yesNo.toLowerCase() === "y") {
      console.log(`\nHooray I am so good at this!\nOnly took ${guesses} guesses!`);
      rematch();
    }
    // Game over :(
    else {
      console.log(
        "\nWhat did you just type???\nYou're done dude\nI can't even...\n"
      );
    }
  });
}

async function reverseStart() {
  console.log(
    "\n\nLet's play a game where I (computer) make up a number and you (human) try to guess it."
  );

  // Lowest possible guess, casted to number
  let min = await ask("\nWhat is your minimum number?\n");
  while (min < 1) {
    min = await ask("\nWhat is your minimum number?\n");
  }
  min = parseInt(min);

  // Highest possible guess, casted to number
  let max = await ask("\nWhat is your maximum number?\n");
  while (max <= min) {
    max = await ask("\nWhat is your maximum number?\n");
  }
  max = parseInt(max);

  // The secret number randomly generated by computer
  let secretNumber = Math.floor(Math.random() * (max - min) + min);

  // Number of guesses
  let guesses = 0;

  console.log("\nAwesome! I'm ready. Press any key to continue...");

  // Begin guessing numbers
  process.stdin.once("data", async function guessNumber() {
    guesses++;
    let guess = await ask("Guess my number!\n");

    // Loop while guess isn't correct
    while (guess !== secretNumber) {
      guess = parseInt(guess);
      // Guess is higher than secret number, log hint
      if (guess > secretNumber) {
        console.log("\nNope! it is Lower than that!");
        guesses++;
        guess = await ask("Guess my number!\n");
      }
      // Guess is lower than secret number, log hint
      else if (guess < secretNumber) {
        console.log("\nNope! it is Higher than that!");
        guesses++;
        guess = await ask("Guess my number!\n");
      }
      // Guess is secret number! break
      else if (guess === secretNumber) {
        break;
      }
      // Error Handling / Code Hygiene
      else {
        console.log("\nWoah there bucko, that's not a number...\n");
        guess = await ask("Guess my number!\n");
      }
    }

    // Congrats, process.exit()
    console.log(`\nYou guessed it! Congrats!\nOnly took ${guesses} guesses!`);
    rematch();
  });
}
