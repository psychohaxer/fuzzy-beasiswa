function inDiv(s) {
	return ("<div>"+ s + "</div>");
	}
	function lbDiv(lbl,s) {
	return ('<div class="label label-'+ lbl + '">'+ s +'</div>');
	}
	function alDiv(lbl,s) {
	return ('<div class="alert alert-'+ lbl + '">'+ s +'</div>');
	}
	
	//fungsi obj fungsi keanggotaan
	var linier_turun = function(va,vb) {
	this.a = va;
	this.b = vb;
	this.u = function (x){
		var a=this.a;
		var b=this.b;
		var y=0;
		if((x<a)) y=1;
		else if((x=>a) && (x<=b)) y = (b-x)/(b-a);
		else if ((x>b)) y=0;
		return y;
		}
	}

	var linier_naik = function(va,vb){
	this.a = va;
	this.b = vb;
	this.u = function (x){
		var a=this.a;
		var b=this.b;
		var y=0;
		if((x<a)) y=0;
		else if((x=>a) && (x<=b)) y = (x-a)/(b-a);
		else if ((x>b)) y=1;
		return y;
		}
	}

	var segitiga = function(va,vb,vc){
	this.a = va;
	this.b = vb;
	this.c = vc;
	this.u = function (x){
		var a=this.a;
		var b=this.b;
		var c=this.c;
		var y =0;
		if((x<a) || (x>c)) y=0;
		else if((x=>a) && (x<=b)) y = (x-a)/(b-a);
		else if ((x>b) && (x<=c)) y=(c-x)/(c-b);
		return y;
		}
	}	

	var trapesium = function(va,vb,vc,vd){
	this.a = va;
	this.b = vb;
	this.c = vc;
	this.d = vd;
	this.u = function (x){
		var a=this.a;
		var b=this.b;
		var c=this.c;
		var d=this.d;
		var y =0;
		if((x<a) || (x>d)) y=0;
		else if((x>=a) && (x<=b)) y = (x-a)/(b-a);
		else if ((x>b) && (x<c)) y=1;
		else if ((x>=c) && (x<=d)) y=(d-x)/(d-c);
		return y;
		}
	}
	//end fungsi obj fungsi keanggotaan
	
	function mf_IPK(x){
		var buruk = new linier_turun(2,2.75);
		var cukup = new segitiga(2,2.75,3.25);
		var bagus = new linier_naik(2.75,3.25);
		return {
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
		//return [kecil.u(x), sedang.u(x), besar.u(x), sangatbesar.u(x)];
		;
		return {
			"kecil": kecil.u(x),
			"sedang": sedang.u(x),
			"besar": besar.u(x),
			"sangatbesar": sangatbesar.u(x)
		};
	}

	function mf_kelayakan(x){
		var rendah = new linier_turun(50,80);
		var tinggi = new linier_naik(50,80);
		return {
			"rendah": rendah.u(x),
			"tinggi": tinggi.u(x)
			};
	}
	function mf_kelayakan_singleton(x){
		return {
			"rendah": 50,
			"tinggi": 80
			};
	}

	function fmin(a,b){
	return Math.min(a,b);
	}

	function fmax(arr){ //arr
		var a=0;
		for (var i in arr){
			a = Math.max(a,arr[i]);
		}
		return a;
	}

	function fmaxMin(a,b,c,d){
		return 	Math.max(Math.min(a,b), Math.min(c,d));
	}

	function fcog(a,b){
		for(var i=0; i<i; i+=10){
		}
	}

	function klik_proses(){
		//alert('ok');
		//var ipk = 3;
		var ipk = parseFloat($('#inIPK').val());
		console.log('ipk : '+ ipk);
		
		ipk = mf_IPK(ipk);
		console.log(ipk);
		
		//var gaji = 10;
		var gaji = parseFloat($('#inGaji').val());
		console.log('gaji : '+ gaji);
		
		gaji = mf_gaji(gaji);
		console.log(gaji);
		
		var rendah = [];
		var tinggi = [];
		
		//aturan/rules
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
		
		//defuzz mamdani
		var sa = 0;
		var sb = 0;
		var aa = 10;
		for(var i=aa; i<=100; i+=aa) {
			layak = mf_kelayakan(i);
			c = fmaxMin(layak.rendah,rendah,layak.tinggi,tinggi);
			sa +=i*c;
			sb +=c;
		}
		var mm = sa/sb;
		
		console.log ('layak rendah : ' + rendah);
		console.log ('layak tinggi : ' + tinggi);
		console.log ('kelayakan mamdani : ' + mm);
		
		//defuzz singleton Sugeno
		layak = mf_kelayakan_singleton();
		var ss = (layak.rendah*rendah) + (layak.tinggi*tinggi);
		ss = ss/(rendah+tinggi);
		console.log('Kelayakan singleton sugeno : '+ss);
		
		var str = '<hr>';
		str += '<hl>Hasil: ';
		
		str += '</hl>';
		str+= alDiv('info','kelayakan mamdani : ' + mm);
		str+= alDiv('warning','kelayakan sugeno singleton : ' + ss);
		
		$('#divOut').hide();
		$('#divOut').html(str);
		$('#divOut').slideDown('slow');
	}
	$(document).ready(function(){
		console.log('ready');
		$('#btnProses').click(klik_proses);
	});