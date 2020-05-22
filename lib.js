var indexedDBObject;

var inputTgt;

function initApp() {

  /* ブラウザの右クリックメニューを使えなくする */
  document.getElementsByTagName('html')[0].oncontextmenu = function () { return false; }
}

function setSelectTab(tabId, index) {
  const elTabList = document.getElementById(tabId).children[0];
  selectTab(elTabList.children[index]);
}

function initIndexedDB() {

  var indexedDB = window.indexedDB || window.mozIndexedDB || window.msIndexedDB;
  if (indexedDB) {
    // データベースを削除したい場合はコメントを外します。
    //indexedDB.deleteDatabase("mydb");
    var openRequest = indexedDB.open("mydb", 1.0);

    openRequest.onupgradeneeded = function (event) {
      // データベースのバージョンに変更があった場合(初めての場合もここを通ります。)
      indexedDBObject = event.target.result;
      var store = indexedDBObject.createObjectStore("mystore", { keyPath: "mykey" });

      // インデックスを作成します。
      store.createIndex("myvalueIndex", "myvalue");
    }
  } else {
    window.alert("このブラウザではIndexed DataBase API は使えません。");
  }
}

function getIndexDBValue(key) {

  var indexedDB = window.indexedDB || window.mozIndexedDB || window.msIndexedDB;
  if (indexedDB) {
    openRequest.onsuccess = function (event) {
      indexedDBObject = event.target.result;

      var transaction = indexedDBObject.transaction(["mystore"], "readwrite");
      var store = transaction.objectStore("mystore");

      var request = store.get(key);
      request.onsuccess = function (event) {
        return request.result.myvalue;
      }
    }
  } else {
    window.alert("このブラウザではIndexed DataBase API は使えません。");
  }
  return null;
}

function saveIndexDBValue(key, value) {
  var transaction = indexedDBObject.transaction(["mystore"], "readwrite");
  var store = transaction.objectStore("mystore");
  var request = store.put({ mykey: key, myvalue: value});
  syncFormatList();
  request.onsuccess = function (event) {
    alert('保存しました。');
  }
}

function selectTab(obj) {
  let base = obj.parentNode.parentNode;
  let tabs = base.children[0].children;
  let conts = base.children[1].children;
  let curIndex = -1;
  for (let i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove('tab-active');
    conts[i].classList.remove('cont-active');
    if (tabs[i] == obj) {
      curIndex = i;
    }
  }
  tabs[curIndex].classList.add('tab-active');
  conts[curIndex].classList.add('cont-active');
}

function openInput(e, obj, width) {
  const wnd = document.getElementById('input-wnd');
  wnd.style.left = e.pageX + "px";
  wnd.style.top = e.pageY + "px";
  wnd.style.width = width + "px";
  inputTgt = obj;
  const form = wnd.children[0];
  form.value = obj.innerHTML;
  form.focus();
}

function lost() {
  const wnd = document.getElementById('input-wnd');
  wnd.style.width = "0";
}

function enterInput(e, obj) {
  if (13 !== e.keyCode) return;

   const value = obj.value;
   this.inputTgt.innerHTML = value;
   lost();

   afterProcess(obj.parentNode.children[1].innerHTML);
  
  // afterProcess(cc);
}

function setInputAfter(arg) {
  const wnd = document.getElementById('input-wnd');
  wnd.children[1].innerHTML = arg;
}

function afterProcess(arg) {
  const func = new Function(`${arg}()`);
  func();
}