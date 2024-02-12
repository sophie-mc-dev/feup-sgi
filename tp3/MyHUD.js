/*
Elapsed time
Number of laps completed
Maximum speed, which may appear different if:
increased by power-up
reduced by obstacle
reduced due to the car being off the track
Remaining benefit/penalty time (due to power-up/obstacle)
Running/paused status game.
*/
class MyHeadsUpDisplay {
    constructor(myReader) {
      this.contents = myReader;
      this.app = myReader.app;
      // Create a container for HUD elements
      this.container = document.createElement('div');
      this.container.style.position = 'absolute';
      this.container.style.top = '80px';
      this.container.style.left = '10px';
      document.body.appendChild(this.container);
  
      // Initialize HUD elements
      this.elapsedTimeElement = this.createHUDElement('Elapsed Time: 00:00:00');
      this.lapsCompletedElement = this.createHUDElement('Laps Completed: 0');
      this.maxSpeedElement = this.createHUDElement('Max Speed: 0 km/h');
      //this.remainingTimeElement = this.createHUDElement('Remaining Time: 0s');
      this.gameStatusElement = this.createHUDElement('Game Status: Running');
      this.selectedManualCar = this.createHUDElement('Selected Manual Car: null');
      this.selectedAutoCar = this.createHUDElement('Selected Auto Car: null');
      this.player = this.createHUDElement('Player: null');
      this.mode = this.createHUDElement('Difficulty: EASY');
      this.speedUpDurationElement = this.createHUDElement('Speed Up Duration: 0s', '#00ff00');
      this.speedDownDurationElement = this.createHUDElement('Speed Down Duration: 0s', '#ff0000');
  
      // Add elements to the container
      this.container.appendChild(this.elapsedTimeElement);
      this.container.appendChild(this.lapsCompletedElement);
      this.container.appendChild(this.maxSpeedElement);
      //this.container.appendChild(this.remainingTimeElement);
      this.container.appendChild(this.gameStatusElement);
      this.container.appendChild(this.selectedManualCar);
      this.container.appendChild(this.selectedAutoCar);
      this.container.appendChild(this.player);
      this.container.appendChild(this.mode);
      this.container.appendChild(this.speedUpDurationElement);
      this.container.appendChild(this.speedDownDurationElement);
  
      // Initialize properties
      this.startTime = new Date();
      this.elapsedTime = 0;
      this.lapsCompleted = 0;
      this.maxLaps = 3;
      this.maxSpeed = 0;
      this.remainingTime = 60; // Set an initial remaining time (in seconds)
      this.totalPausedTime = 0; // Total time the game has been paused
      this.pauseStartTime = null; // Time the current pause started
      this.speedUpDuration = 0; // Total time the power up has been active
      this.speedDownDuration = 0; // Total time the obstacle has been active
      this.finalTime = null;
      this.powerUpsTime = 0;
    }

    createHUDElement(text, color = '#ffffff') {
      const element = document.createElement('div');
      element.style.marginBottom = '10px';
      element.style.fontFamily = 'Arial, sans-serif';
      element.style.fontSize = '18px';
      element.style.color = color;
      element.innerText = text;
      return element;
    }
  
    update() {
      this.selectedManualCar.innerText = `Selected Manual Car: ${this.contents.selectedManualCar ? this.contents.selectedManualCar.name : 'null'}`; 
      this.selectedAutoCar.innerText = `Selected Auto Car: ${this.contents.selectedAutoCar ? this.contents.selectedAutoCar.name : 'null'}`; 
      this.player.innerText = `Player: ${this.contents.playerName ? this.contents.playerName : 'null'}`;
      this.mode.innerText = `Difficulty: ${this.contents.mode ? this.contents.mode : 'null'}`;

        if(this.contents.myRoute.mixerPause && this.pauseStartTime != null) return;

        if(this.contents.myRoute.mixerPause && this.pauseStartTime == null) {
            this.pauseStartTime = new Date();
        }
        if(!this.contents.myRoute.mixerPause && this.pauseStartTime != null) {
            const pauseTime = new Date();
            const pauseDuration = (pauseTime - this.pauseStartTime) / 1000; // Convert to seconds

            // Add the pause duration to the total paused time
            this.totalPausedTime += pauseDuration;

            // Set the pause start time for the next pause
            this.pauseStartTime = null;
        }

        if (this.speedUpDuration > 0) {
          const actualTime = new Date();
          this.speedUpDurationElement.innerText = `Speed Up Time: ${((this.endSpeedUpTime - actualTime) / 1000).toFixed(1)}s`;
          this.speedUpDurationElement.style.display = 'block';
          if (actualTime > this.endSpeedUpTime) {
            this.speedUpDuration = 0;
            this.speedUpDurationElement.style.display = 'none';
          }
        } else {
          // If speed-up duration is 0, hide the speed-up time element
          this.speedUpDurationElement.style.display = 'none';
        }

        if (this.speedDownDuration > 0) {
          const actualTime = new Date();
          this.speedDownDurationElement.innerText = `Speed Down Time: ${((this.endSpeedDownTime - actualTime) / 1000).toFixed(1)}s`;
          this.speedDownDurationElement.style.display = 'block';
          if (actualTime > this.endSpeedDownTime) {
            this.speedDownDuration = 0;
            this.speedDownDurationElement.style.display = 'none';
          }
        }
        else {
          // If speed-down duration is 0, hide the speed-down time element
          this.speedDownDurationElement.style.display = 'none';
        }
        // // Update max speed
        // if(this.myVehicle.manualCarModels[0].speed > this.maxSpeed) {
        //     this.maxSpeed = this.contents.myRoute.speed;
        // }

        // Update elapsed time
        const currentTime = new Date();
        this.elapsedTime = (currentTime - this.startTime) / 1000 - this.totalPausedTime - this.powerUpsTime; // Subtract the total paused time

        // Update HUD elements with current game information
        this.elapsedTimeElement.innerText = `Elapsed Time: ${this.formatTime(this.elapsedTime)}`;
        this.lapsCompletedElement.innerText = `Laps Completed: ${this.lapsCompleted}/${this.maxLaps}`;
        this.maxSpeedElement.innerText = `Max Speed: ${(this.maxSpeed*10).toFixed(2)} km/h`;
        //this.remainingTimeElement.innerText = `Remaining Time: ${this.remainingTime.toFixed(1)}s`;
        this.gameStatusElement.innerText = `Game Status: ${this.contents.myRoute.mixerPause ? 'Paused' : 'Running'}`;

        if(this.maxLaps === this.lapsCompleted && this.finalTime === null) {
            this.finalTime = this.elapsedTime;
        }
    }

    startSpeedUp(duration) {
      this.speedUpDuration = duration;
      this.startSpeedUpTime = new Date();
      this.endSpeedUpTime = new Date(this.startSpeedUpTime.getTime() + duration * 1000);
    }

    startSpeedDown(duration) {
      this.speedDownDuration = duration;
      this.startSpeedDownTime = new Date();
      this.endSpeedDownTime = new Date(this.startSpeedDownTime.getTime() + duration * 1000);
    }
  
    formatTime(seconds) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = Math.floor(seconds % 60);
  
      const formattedTime = `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(remainingSeconds)}`;
      return formattedTime;
    }
  
    pad(number) {
      return number.toString().padStart(2, '0');
    }

    increaseElapsedTime(timePenalty){
      this.powerUpsTime -= timePenalty;
    }
  }

  export { MyHeadsUpDisplay };
  