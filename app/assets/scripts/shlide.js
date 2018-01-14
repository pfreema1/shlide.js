class Shlide {
  
  constructor(el, options) {
    this.shlideEl = el;
    this.shlideImgEls = document.querySelectorAll(".shlide-image");
    

    /*  dom layout:
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

    this.styleElements();



    //bindings 
    this.setUpDOM = this.setUpDOM.bind(this);
    this.styleElements = this.styleElements.bind(this);
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

  styleElements() {

    /* style shlide element */
    

  }


}