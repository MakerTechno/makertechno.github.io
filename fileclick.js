var inclick = 0;
function fork(){
	inclick = inclick+1;
	if(inclick>=50){
		try{
			window.location.href="./MakerStudio/index.html";
		}catch(e){
		}
	}
}