class CreditsPage {
    constructor() {
        this.credits = {
            creator: "John Doe",
            designer: "Jane Smith"
        };
        this.passcode = "331428"; // Updated passcode
    }

    displayCredits() {
        console.log("Credits Page:");
        console.log(`Created by: ${this.credits.creator}`);
        console.log(`Design by: ${this.credits.designer}`);
    }

    editCredits(inputPasscode) {
        if (inputPasscode !== this.passcode) {
            console.log("Incorrect passcode!");
            return;
        }

        const newCreator = prompt("Enter new creator name:");
        const newDesigner = prompt("Enter new designer name:");

        if (newCreator) this.credits.creator = newCreator;
        if (newDesigner) this.credits.designer = newDesigner;

        console.log("Credits updated successfully!");
        this.displayCredits();
    }
}

// Example usage:
const creditsPage = new CreditsPage();
creditsPage.displayCredits();

// To edit, call creditsPage.editCredits("331428");
