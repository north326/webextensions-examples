function showCookiesForTab(tabs) {
  //get the first tab object in the array
  let tab = tabs.pop();

  //get all cookies in the domain
  var gettingAllCookies = browser.cookies.getAll({url: tab.url});
  gettingAllCookies.then((cookies) => {

    //set the header of the panel
    // var activeTabUrl = document.getElementById('header-title');
    var text = document.createTextNode("Cookies at: "+tab.title);
    var cookieList = document.getElementById('cookie-list');
    // activeTabUrl.appendChild(text);

    if (cookies.length > 0) {
      //add an <li> item with the name and value of the cookie to the list
      for (let cookie of cookies) {
        let li = document.createElement("li");
        let content = document.createTextNode(cookie.name + ": "+ cookie.value);
        li.appendChild(content);
        cookieList.appendChild(li);
      }
    } else {
      let p = document.createElement("p");
      let content = document.createTextNode("No cookies in this tab.");
      let parent = cookieList.parentNode;

      p.appendChild(content);
      parent.appendChild(p);
    }

    
  });

  const btn = document.getElementById("update");
  btn.onclick = ()=>{
    
    let xmlhttp=new XMLHttpRequest();
    const dataEL = document.getElementById("dataDiv");

    xmlhttp.onreadystatechange=function(){
      //dataEL.innerHTML= JSON.stringify(xmlhttp)+xmlhttp.responseText;
      if (xmlhttp.readyState==4 && xmlhttp.status==200){
        const data = xmlhttp.responseText;
        dataEL.innerHTML="Success";

        //rm old cookies
        var gettingAllCookies = browser.cookies.getAll({url: tab.url});
        gettingAllCookies.then((cookies) => {
          if (cookies.length > 0) {
            for (let cookie of cookies) {
              browser.cookies.remove({name:cookie.name,url:tab.url})
            }
          } 
        });
        browser.cookies.set({url:tab.url,name:"frombkkc",value:data})
      }else{
        dataEL.innerHTML="Fail";
      }
    }
    xmlhttp.open("GET","http://192.168.199.226:32100/cookie");
    xmlhttp.send();
  }

}

//get active tab to run an callback function.
//it sends to our callback an array of tab objects
function getActiveTab() {
  return browser.tabs.query({currentWindow: true, active: true});
}
getActiveTab().then(showCookiesForTab);
