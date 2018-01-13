class Shlide {
  
  constructor(el, options) {
    this.containerEl = el;
    this.imageElements = document.querySelectorAll(".shlide-image");

    //interaction variables
    this.isSwiping = false;
    this.touchStartCoords = { "x": -1, "y": -1 };
    this.touchEndCoords = { "x": -1, "y": -1 };

    this.wrapImagesInDiv();
    //imageWrapperEl created in wrapImagesInDiv() method
    this.addMultipleListeners(this.imageWrapperEl, "mousedown touchstart", this.swipeStart.bind(this));
    this.addMultipleListeners(this.imageWrapperEl, "mousemove touchmove", this.swipeMove.bind(this));
    this.addMultipleListeners(this.imageWrapperEl, "mouseup touchend", this.swipeEnd.bind(this));



    this.setWrapperStyling(options);
    this.setImageStyling(options);


    //bindings
    this.wrapImagesInDiv = this.wrapImagesInDiv.bind(this);
    this.setWrapperStyling = this.setWrapperStyling.bind(this);
    this.setImageStyling = this.setImageStyling.bind(this);
    this.swipeStart = this.swipeStart.bind(this);
    this.swipeMove = this.swipeMove.bind(this);
    this.swipeEnd = this.swipeEnd.bind(this);
    this.addMultipleListeners = this.addMultipleListeners.bind(this);
  }

  wrapImagesInDiv() {
    //create wrapper element
    let imageWrapperEl = document.createElement("div");
    imageWrapperEl.classList.add("shlide-image-wrapper");

    //insert wrapper before first image in the DOM tree
    this.imageElements[0].parentNode.insertBefore(imageWrapperEl, this.imageElements[0]);

    //move images into wrapper
    for(let i = 0; i < this.imageElements.length; i++) {
      imageWrapperEl.appendChild(this.imageElements[i]);
    }

    this.imageWrapperEl = imageWrapperEl;
  }


  setWrapperStyling(options) {
    this.imageWrapperEl.style.display = "flex";
    this.imageWrapperEl.style.justifyContent = "center";
    this.imageWrapperEl.style.alignItems = "center";

    this.imageWrapperEl.style.height = options.shlideContainerHeight;
    this.imageWrapperEl.style.width = options.shlideContainerWidth;

    // this.imageWrapperEl.style.overflow = "hidden";

    this.imageWrapperEl.style.position = "relative";
    this.imageWrapperEl.style.left = "0px";
  }

  setImageStyling(options) {
    for(let i = 0; i < this.imageElements.length; i++) {
      options.maxImageHeight ? this.imageElements[i].style.maxHeight = options.maxImageHeight : null;
      options.maxImageWidth ? this.imageElements[i].style.maxWidth = options.maxImageWidth : null;
      options.padding ? (this.imageElements[i].style.paddingLeft = options.padding, 
                         this.imageElements[i].style.paddingRight = options.padding) : null;

      //prevents the dragging of ghost image
      this.imageElements[i].draggable = false;
      
    }
  }

  addMultipleListeners(el, s, fn) {
    var evts = s.split(' ');
    for(let i = 0; i < evts.length; i++) {
      el.addEventListener(evts[i], fn, false);
    }
  }
  
  swipeStart(ev) {
    console.log("swipeStart() called");
    this.isSwiping = true;
    

    this.touchStartCoords = { "x": ev.pageX, "y": ev.pageY };

    
  }

  swipeMove(ev) {
    
    if(this.isSwiping) {

      let movementAmount = (ev.pageX - this.touchStartCoords.x) / 10;
      let currentLeftAmount = parseInt(this.imageWrapperEl.style.left.slice(0, this.imageWrapperEl.style.left.length -1));

      console.log("currentLeftAmount:  " + currentLeftAmount);

      console.log("movementAmount:  " + movementAmount);
      this.imageWrapperEl.style.left = (currentLeftAmount + movementAmount) + "px";
    }
  }

  swipeEnd(ev) {
    console.log("swipeEnd() called");
    this.isSwiping = false;
    console.log(ev);
    console.log("ev.pageX:  " + ev.pageX);

    this.touchStartCoords = { "x": -1, "y": -1 };
    this.touchEndCoords = { "x": ev.pageX, "y": ev.pageY };

    console.log("this.imageWrapperEl.style.left:  " + this.imageWrapperEl.style.left);
  }


}

