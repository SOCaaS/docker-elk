export class createSwitch {
    constructor(checked, setChecked) {
      this.checked = checked;
      this.setChecked = setChecked;
    }
    onChange = (e) => {
      this.setChecked(e.target.checked);
    };
  }