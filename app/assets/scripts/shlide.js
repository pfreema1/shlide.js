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

    this.setWidthAndPositionOfCells();

    this.addMultipleListeners(this.shlideSliderEl, "mousedown touchstart", this.swipeStart.bind(this));
    this.addMultipleListeners(this.shlideSliderEl, "mousemove touchmove", this.swipeMove.bind(this));
    this.addMultipleListeners(this.shlideSliderEl, "mouseup touchend", this.swipeEnd.bind(this));


    this.getImageHeights();

   

    //bindings 
    this.setUpDOM = this.setUpDOM.bind(this);
    this.setWidthAndPositionOfCells = this.setWidthAndPositionOfCells.bind(this);
    this.swipeStart = this.swipeStart.bind(this);
    this.swipeMove = this.swipeMove.bind(this);
    this.swipeEnd = this.swipeEnd.bind(this);
    this.getImageHeights = this.getImageHeights.bind(this);
    this.heightChecker = this.heightChecker.bind(this);
    this.setShlideViewportHeight = this.setShlideViewportHeight.bind(this);
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

  }


  setWidthAndPositionOfCells() {
    
    let widthOfCell = this.cellSizingScale * this.shlideEl.offsetWidth;
    let tallestImageInPx = 0;

    for(let i = 0; i < this.shlideCellEls.length; i++) {
      this.shlideCellEls[i].style.width = widthOfCell + "px";

      //set left positioning
      this.shlideCellEls[i].style.left = (i * widthOfCell) + "px";

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
    console.log("swipeStart() running");
    console.log(this);
    
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
    console.log("swipeEnd() running");
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

    console.log("transformString:  " + transformString);

    return parseInt(transformString);
  }

  heightChecker(tempImg) {
    tempImg.height > this.tallestImageHeight ? (this.tallestImageHeight = tempImg.height,
                                       this.tallestImageWidth = tempImg.width) : null;
    this.heightCheckerCounter++;

    if(this.heightCheckerCounter === this.shlideCellEls.length) {
      this.setShlideViewportHeight();
    }
  }

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

  setShlideViewportHeight() {
    console.log("this.tallestImageHeight:  " + this.tallestImageHeight);
    console.log("this.tallestImageWidth:  " + this.tallestImageWidth);
    console.log("this.shlideEl.width:  " + this.shlideEl.style.width);

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
    // calculate aspect ratio --- (original height / original width) x new width = new height
    let newHeight = (this.tallestImageHeight / this.tallestImageWidth) * allImagesWidth;
    

    //this.cellSizingScale = 0.75;
    console.log(newHeight);

    
    this.shlideViewportEl.style.height = newHeight + "px";
  }

 


}