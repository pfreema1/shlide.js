class Shlide {
  
  constructor(el, options) {
    this.containerEl = el;
    this.maxElementHeight = options.maxElementHeight;
    this.maxElementWidth = options.maxElementWidth;

    // console.log("this.containerEl:  " + this.containerEl);
    // console.log("this.maxHeight:  " + this.maxHeight);
    // console.log("this.maxWidth:  " + this.maxWidth);

    this.setContainerStyling = this.setContainerStyling.bind(this);

    this.setContainerStyling();
  }

  setContainerStyling() {
    this.containerEl.style.display = "flex";
    this.containerEl.style.justifyContent = "center";
    this.containerEl.style.alignItems = "center";
  }


}