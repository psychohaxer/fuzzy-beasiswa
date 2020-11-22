function inDiv(s){
    return ("div>"+ s + "</div>");
}

function lbDic(lbl,s){
    return ('<div class="label label-' + lbl + '">' + s + '</div>');
}

function alDiv(lbl,s){
    return ('<div class="label label-' + lbl + '">' + s + '</div>');
}

var linier_turun = function(va,vb){
    this.a = va;
    this.b = vb;
    this.u = function (x){
        var a = this.a;
        var b = this.b;
        var y = 0;
        
        if ((x<a)){
            y = 1;
        }
        else if ((x=>a) && (x<=b)) {
            y = (b-x)/(b-a);
        }
        else if ((x>b)) {
            y = 0;
        }            
            
        return y;
    }
}

var linier_naik = function(va,vb){
    this.a = va;
    this.b = vb;
    this.u = function(x){
        var a = this.a;
        var b = this.b;
        var y = 0;
        
        if ((x<a)){
            y = 0;
        }            
        else if ((x=>a) && (x<=b)){
            y = (x-a)/(b-a);
        }            
        else if ((x>b)){
            y = 1;
        }            
            
        return y;
    }
}

var segitiga = function(va,vb,vc){
    this.a = va;
    this.b = vb;
    this.c = vc;
    this.u = function(x){
        var a = this.a;
        var b = this.b;
        var c = this.c;
        var y = 0;
        
        if ((x<a) || (x>c)){
            y = 0;
        }            
        else if ((x=>a) && (x<=b)){
            y = (x-a)/(b-a);
        }            
        else if ((x>b)){
            y = (c-x)/(c-b);
        }            
            
        return y;
    }
}

var trapesium = function(va,vb,vc,vd){
    this.a = va;
    this.b = vb;
    this.c = vc;
    this.d = vd;
    this.u = function(x){
        var a = this.a;
        var b = this.b;
        var c = this.c;
        var y = 0;
        
        if ((x<a) || (x>d)){
            y = 0;
        }            
        else if ((x=>a) && (x<=b)){
            y = (x-a)/(b-a);
        }            
        else if ((x>b) && (x<c)){
            y = 1;
        }            
        else if ((x>=c) && (x<=d)){
            y = (d-x)/(d-c);
        }            

        return y;
    }
}

function mf_IPK(x){
    var buruk = new linier_turun(2, 2.75);
    var cukup = new segitiga(2, 2.75, 3.325);
    var bagus = new segitiga(2.75, 3.25);
    
    return{
        "buruk": buruk.u(x),
        "cukup": cukup.u(x),
        "bagus": bagus.u(x)
    };
}

function mf_gaji(x){
    var kecil = new linier_turun(1,3);
    var sedang = new trapesium(1,3,4,6);
    var besar = new trapesium(4,6,7,12);
    var sangatbesar = new linier_naik(7,12);
    
    return{
        "kecil": kecil.u(x),
        "sedang": sedang.u(x),
        "besar": besar.u(x),
        "sangatbesar": sangatbesar.u(x)
    };
}

function mf_kelayakan(x){
    var rendah = new linier_turun(50,80);
    var tinggi = new linier_naik(50,80);
    
    return{
        "kecil": kecil.u(x),
        "kecil": kecil.u(x)
    }
}

function mf_kelayakan_singleton(){
    return{
        "rendah": 50,
        "tinggi": 80
    }
}

function fmin(a,b){
    return Math.min(a,b);
}

function fmax(arr){
    var a = 0;
    for (var i in arr){
        a = Math.max(a,arr[i]);
    }
    
    return a;
}

function fmaxMin(a,b,c,d){
    return Math.max(Math.min(a,b),Math.min(c,d));
}

function fcog(a,b){
    for (var i=0;i<i; i+=10){
    
    }
}

function klik_proses(){
    var ipk = parseFloat($('#inIPK').val());
    console.log('IPK: '+ipk);
    
    ipk = mf_IPK(ipk);
    console.log(ipk);
    
    var gaji = parseFloat($('#inGaji').val());
    console.log('Gaji: '+gaji);
    
    ipk = mf_gaji(gaji);
    console.log(gaji);
    
    var rendah = [];
    var tinggi = [];
    
    rendah.push(fmin(ipk.buruk,gaji.kecil));
    rendah.push(fmin(ipk.buruk,gaji.sedang));
    rendah.push(fmin(ipk.buruk,gaji.besar));
    rendah.push(fmin(ipk.buruk,gaji.sangatbesar));
    
    tinggi.push(fmin(ipk.cukup,gaji.kecil));
    rendah.push(fmin(ipk.cukup,gaji.sedang));
    rendah.push(fmin(ipk.cukup,gaji.besar));
    rendah.push(fmin(ipk.cukup,gaji.sangatbesar));
    
    tinggi.push(fmin(ipk.bagus,gaji.kecil));
    tinggi.push(fmin(ipk.bagus,gaji.sedang));
    tinggi.push(fmin(ipk.bagus,gaji.besar));
    rendah.push(fmin(ipk.bagus,gaji.sangatbesar));
    
    tinggi = fmax(tinggi);
    rendah = fmax(rendah);
    
    var sa = 0;
    var sb = 0;
    var aa = 10;
    for (var i=aa; i<=100; i+=aa){
        layak = mf_kelayakan(i);
        c = fmaxMin(layak.rendah,rendah,layak.tinggi,tinggi);
        sa += i*c;
        sb += c;
    }
    
    var mm = sa/sb;
    
    console.log('Layak Rendah: '+rendah);
    console.log('Layak Tinggi: '+tinggi);
    console.log('Kelayakan Mamdani: '+mm);
    
    layak = mf_kelayakan_singleton();
    var ss = (layak.rendah*rendah)+(layak.tinggi*tinggi);
    ss = ss/(rendah+tinggi);
    console.log('Kelayakan Singleton Sugeno: '+ss);
    
    var str = '<hr>';
    str += '<h1>Hasil: ';
    
    str += '</h1>';
    str += alDiv('Info','Kelayakan Mamdani: '+mm);
    str += alDiv('Warning','Kelayakan Singleton Sugeno: '+ss);
    
    $('#divOut').hide();
    $('#divOut').html(str);
    $('#divOut').slideDown('slow');
    
}
    
$(document).ready(function(){
    console.log('ready');
    $('#btnProses').click(klik_proses);
});          