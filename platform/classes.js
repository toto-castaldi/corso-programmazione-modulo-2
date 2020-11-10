class Palla {
    constructor(pX) {
        if (pX != undefined) {
            this.x = pX;
        } else {
            this.x = 10;
        }
    }

    rotola() {
        console.log(this.x);
    }
}

class PallaDiCalcio extends Palla {

    constructor() {
        super(20);
    }

}



let p = new Palla();
p.rotola();