
class vecn {

    data: number[] | null;

    constructor(dimension: number) {
        this.data = new Array<number>(dimension);
    }

};

class vec3
{
    x:number;
    y:number;
    z:number;

    
    set(_x:number, _y:number, _z:number)
    {
        this.x = _x;
        this.y = _y;
        this.z = _z;

    }

    setVecn(other:vecn) {
        this.x = other[0];
        this.y = other[1];
        this.z = other[2];
    }

    divide(w:number)
    {
        this.x /=w;
        this.y /=w;
        this.z /=w;
        
    }



}

class vec2
{
    x:number;
    y:number;

    
}

