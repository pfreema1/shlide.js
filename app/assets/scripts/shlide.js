class Shlide {
  
  constructor(el, options) {
    this.shlideEl = el;
    this.shlideImgEls = document.querySelectorAll(".shlide-image");
    this.isSwiping = false;
    this.endingTranslateX = 0;
    this.tallestImageHeight = 0;
    this.heightCheckerCounter = 0;
    this.shlideEl.style.width = options.width;
    this.cellSizingScale = 0.75;
    this.imageDimensionInfoArray = [];
    options.padding ? this.padding = parseInt(options.padding.slice(0, options.padding.length - 2)) : this.padding = 0;
    this.rafId = undefined;
    this.amountAnimated = 0;

    /*  DOM layout:
        div.shlide
          div.shlide-viewport
            div.shlide-slider
              div.shlide-cell
                img.shlide-img
                img.shlide-img
                img.shlide-img
          button
          button
          ol

    */
    this.setUpDOM();

    this.initImageDimensionInfoArray();

    this.setWidthAndPositionOfCells();

    this.addMultipleListeners(this.shlideSliderEl, "mousedown touchstart", this.swipeStart.bind(this));
    this.addMultipleListeners(this.shlideSliderEl, "mousemove touchmove", this.swipeMove.bind(this));
    this.addMultipleListeners(this.shlideSliderEl, "mouseup touchend", this.swipeEnd.bind(this));


    this.getImageHeights();

    //set initial transform
    this.shlideSliderEl.style.transform = "translate3d(0px, 0px, 0px)";

   

    //bindings 
    this.setUpDOM = this.setUpDOM.bind(this);
    this.setWidthAndPositionOfCells = this.setWidthAndPositionOfCells.bind(this);
    this.swipeStart = this.swipeStart.bind(this);
    this.swipeMove = this.swipeMove.bind(this);
    this.swipeEnd = this.swipeEnd.bind(this);
    this.getImageHeights = this.getImageHeights.bind(this);
    this.heightChecker = this.heightChecker.bind(this);
    this.setShlideViewportHeight = this.setShlideViewportHeight.bind(this);
    this.centerImagesInShlideViewport = this.centerImagesInShlideViewport.bind(this);
    this.initImageDimensionInfoArray = this.initImageDimensionInfoArray.bind(this);
    this.addImageOriginalDimensionInfo = this.addImageOriginalDimensionInfo.bind(this);
    this.addImageNewDimensionInfo = this.addImageNewDimensionInfo.bind(this);
    this.setNewImageHeights = this.setNewImageHeights.bind(this);
    this.positionButtons = this.positionButtons.bind(this);
    this.animLoop = this.animLoop.bind(this);
    this.stopAnim = this.stopAnim.bind(this);
  }

  setUpDOM() {
    this.shlideViewportEl = document.createElement("div");
    this.shlideViewportEl.classList.add("shlide-viewport");
    this.shlideSliderEl = document.createElement("div");
    this.shlideSliderEl.classList.add("shlide-slider");
    

    //wrap image elements in div.shlide-cell 
    for(let i = 0; i < this.shlideImgEls.length; i++) {
      let shlideImageWrapper = document.createElement("div");
      shlideImageWrapper.classList.add("shlide-cell");
      this.shlideImgEls[i].parentNode.insertBefore(shlideImageWrapper, this.shlideImgEls[i]);
      shlideImageWrapper.appendChild(this.shlideImgEls[i]);
    }

    this.shlideEl.prepend(this.shlideViewportEl);
    this.shlideViewportEl.prepend(this.shlideSliderEl);
    
    this.shlideCellEls = document.querySelectorAll(".shlide-cell");

    for(let i = 0; i < this.shlideCellEls.length; i++) {
      this.shlideSliderEl.appendChild(this.shlideCellEls[i]);
    }

    //add buttons and dot elements
    this.shlidePrevButtonEl = document.createElement("button");
    this.shlidePrevButtonEl.classList.add("shlide-button", "shlide-button--previous");
    this.shlideNextButtonEl = document.createElement("button");
    this.shlideNextButtonEl.classList.add("shlide-button", "shlide-button--next");
    this.shlideDotsEl = document.createElement("ol");

    this.shlideEl.appendChild(this.shlidePrevButtonEl);
    this.shlideEl.appendChild(this.shlideNextButtonEl);
    this.shlideEl.appendChild(this.shlideDotsEl);

    //add click event listeners
    this.shlideNextButtonEl.addEventListener("click", this.handleNextButtonClicked.bind(this));
    this.shlidePrevButtonEl.addEventListener("click", this.handlePrevButtonClicked.bind(this));

    this.positionButtons();

  }

  /*
      Initial array of objects that hold image dimension info.  
      The info is needed to be able to dynamically center the images.
  */
  initImageDimensionInfoArray() {
    for(let i = 0; i < this.shlideImgEls.length; i++) {
      let tmpObj = {};
      tmpObj.src = this.shlideImgEls[i].src;
      this.imageDimensionInfoArray.push(tmpObj);
    }

    // console.log(this.imageDimensionInfoArray);
  }


  /*
      set horizontal position of prev and next buttons
  */
  positionButtons() {
    this.shlidePrevButtonEl.style.left = "0px";
    this.shlideNextButtonEl.style.left = (this.shlideEl.offsetWidth - 50) + "px";

  }


  handlePrevButtonClicked() {
    

    this.animDirection = "left";
    this.rafId = window.requestAnimationFrame(this.animLoop);
    
  }

  handleNextButtonClicked() {
    this.animDirection = "right";
    this.rafId = window.requestAnimationFrame(this.animLoop);
  }


  /*
     animation functions
  */
  animLoop() {

    

    //if we havent moved this.animationMovementEndAmount pixels then move and recall RAF
    //else, stop animation
    if(Math.abs(this.amountAnimated) < this.animationMovementEndAmount) {

      this.animDirection === "left" ? this.amountAnimated += 10 : this.amountAnimated -= 10;
      
      let currPos = this.returnTranslateXValue(this.shlideSliderEl);
      console.log(currPos);
      console.log("this.amountAnimated:  " + this.amountAnimated);
      console.log("this.animationMovementEndAmount:  " + this.animationMovementEndAmount);

      this.shlideSliderEl.style.transform = "translate3d(" + (currPos + this.amountAnimated) + "px, 0px, 0px)";

      

      window.requestAnimationFrame(this.animLoop);
    } else {
      // this.endingAnimPos = this.shlideSliderEl.style.left;
      this.stopAnim();
    }
    

    

  
  }

  stopAnim() {
    this.amountAnimated = 0;
    window.cancelAnimationFrame(this.rafId);
  }



  setWidthAndPositionOfCells() {
    
    let widthOfCell = this.cellSizingScale * this.shlideEl.offsetWidth;
    let tallestImageInPx = 0;

    for(let i = 0; i < this.shlideCellEls.length; i++) {
      this.shlideCellEls[i].style.width = widthOfCell + "px";

      //set left positioning
      this.shlideCellEls[i].style.left = (i * (widthOfCell + this.padding)) + "px";

      //disable image dragging
      this.shlideCellEls[i].firstChild.draggable = false;

      // console.log(this.shlideCellEls[i].firstChild.src);
      // console.log(this.showImage(this.shlideCellEls[i].firstChild.src));
    }


  }

  addMultipleListeners(el, s, fn) {
    let evts = s.split(" ");
    for(let i = 0; i < evts.length; i++) {
      el.addEventListener(evts[i], fn, false);
    }
  }

  swipeStart(ev) {
    // console.log("swipeStart() running");
    // console.log(this);
    
    this.isSwiping = true;
    this.touchStartX = ev.pageX;
    this.touchEndX = -1;
  }

  swipeMove(ev) {
    if(this.isSwiping) {
      this.touchMoveX = ev.pageX;
      //calculate how much to translate the slider
      let moveAmount = this.touchMoveX - this.touchStartX;
      // console.log("moveAmount:  " + moveAmount);
      this.shlideSliderEl.style.transform = "translate3d(" + (moveAmount + this.endingTranslateX) + "px, 0, 0)";

    }
  }

  swipeEnd(ev) {
    // console.log("swipeEnd() running");
    this.isSwiping = false;
    this.touchEndX = ev.pageX;

    //get ending translate3d x value so the value doesnt reset each new swipe
    this.endingTranslateX = this.returnTranslateXValue(this.shlideSliderEl);
  }

  returnTranslateXValue(el) {
    let transformString = el.style.transform;

    let startingIndex = transformString.indexOf("3d(") + 3;
    let endingIndex = transformString.indexOf("px");

    transformString = transformString.slice(startingIndex, endingIndex);

    // console.log("transformString:  " + transformString);

    return parseInt(transformString);
  }


  /*
      Compares the height of all the images and gets the tallest one.
      Once we've compared all images we call setShlideViewportHeight
      -tallest image determines the height of the ShlideViewport
      -also calls addImageOriginalDimensionInfo to.....add image original dimension info
  */
  heightChecker(tempImg) {

    this.addImageOriginalDimensionInfo(tempImg);

    tempImg.height > this.tallestImageHeight ? (this.tallestImageHeight = tempImg.height,
                                       this.tallestImageWidth = tempImg.width) : null;
    this.heightCheckerCounter++;

    // run setShlideViewportHeight() after all images have been checked
    if(this.heightCheckerCounter === this.shlideCellEls.length) {
      this.setShlideViewportHeight();
    }
  }

  addImageOriginalDimensionInfo(tempImg) {
    this.imageDimensionInfoArray = this.imageDimensionInfoArray.map(elem => {
      if(elem.src === tempImg.src) {
        elem.origWidth = tempImg.width;
        elem.origHeight = tempImg.height;
      }

      return elem;
    });

    // console.log(this.imageDimensionInfoArray);
  }

  addImageNewDimensionInfo(allImagesWidth) {
    this.imageDimensionInfoArray = this.imageDimensionInfoArray.map(elem => {
      elem.newWidth = allImagesWidth;

      //calculate new height --- (original height / original width) x new width = new height
      elem.newHeight = (elem.origHeight / elem.origWidth) * elem.newWidth;

      return elem;
    });

    //set amount of movement for animation
    this.animationMovementEndAmount = this.imageDimensionInfoArray[0].newWidth;

    this.setNewImageHeights();
  }

  /*
      Sets height of each image.  This is needed to be able to center using
      the top: 50% translateY(-50%) trick to center the images
  */
  setNewImageHeights() {

    // console.log(this.imageDimensionInfoArray);
    // this.shlideCellEls = this.shlideCellEls.map(elem => {
    //   return elem;
    // });

    for(let i = 0; i < this.shlideCellEls.length; i++) {
      // get dimension info for this shlideCellEl 
      let imgDimensionInfo = this.imageDimensionInfoArray.filter((elem) => {
        if(this.shlideCellEls[i].firstChild.src == elem.src) {
          return true;
        } else {
          return false;
        }
      });

      this.shlideCellEls[i].style.height = imgDimensionInfo[0].newHeight + "px";
      // console.log(this.shlideCellEls[i]);
      // console.log(imgDimensionInfo[0].newHeight);
    }

    // now that we have the heights set, lets center the images!
    this.centerImagesInShlideViewport();
  }

  /*
      Loads each image and gets original height.
      -When image loads heightChecker() is called to compare heights and 
       find tallest image
  */
  getImageHeights() {

    for(let i = 0; i < this.shlideCellEls.length; i++) {
      let tempImg = new Image();
      tempImg.src = this.shlideCellEls[i].firstChild.src;
      tempImg.onload = () => {
        // console.log(this);
        // console.log(tempImg.height);
        this.heightChecker(tempImg);   
      };
    }
  } 

  /*
      Sets the shlide viewport height based on the tallest image

  */
  setShlideViewportHeight() {

    let widthOfShlideEl = 0;
    // take off "%" or "px" on shlideEl.style.width and convert to int (in px)
    if(this.shlideEl.style.width.indexOf("%") != -1) {
      // case:  width string is a percentage
      widthOfShlideEl = parseInt(this.shlideEl.style.width.slice(0, this.shlideEl.style.width.length - 1));
      widthOfShlideEl = (widthOfShlideEl / 100) * document.documentElement.clientWidth;
    } else {
      // case:  width string is in px
      widthOfShlideEl = parseInt(this.shlideEl.style.width.slice(0, this.shlideEl.style.width.length - 2));
    }

    // calculate image width
    let allImagesWidth = this.cellSizingScale * widthOfShlideEl;

    // update image dimension info array with new widths and calculate new heights
    this.addImageNewDimensionInfo(allImagesWidth);

    // calculate aspect ratio --- (original height / original width) x new width = new height
    let newShlideViewportHeight = (this.tallestImageHeight / this.tallestImageWidth) * allImagesWidth;
    
    // set new viewport height
    this.shlideViewportEl.style.height = newShlideViewportHeight + "px";

  }

  centerImagesInShlideViewport() {
    console.log("hi there!");
    for(let i = 0; i < this.shlideCellEls.length; i++) {
      
      this.shlideCellEls[i].style.top = "50%";
      this.shlideCellEls[i].style.transform = "translateY(-50%)";
    }

    
  }


}