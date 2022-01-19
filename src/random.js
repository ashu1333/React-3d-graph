import { useEffect } from "react/cjs/react.development";

function capFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getRandomInt(min, max) {
  	return Math.floor(Math.random() * (max - min)) + min;
}

export default function generateName(node){


	var name1 = ["red","yellow","green","blue","violet"]
    var name2 = ["red","yellow","green","blue","violet"]

	var name = name1[getRandomInt(0, name1.length + 1)];
	return name;

}