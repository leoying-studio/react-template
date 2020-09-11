import React, { useRef, useState, useEffect, useCallback } from "react";
//  已测试可以正常使用

const _message = {}

const useEvent = () => {

	const on = useCallback((name, fn) => {
		if (!_message[name]) {
			// 这里之所以用数组存放，是一个订阅名称可以有多个方法
			_message[name] = [fn];
		} else {
			// 如果存在就推到当前的订阅名称对象数组中去。
			_message[name].push(fn);
		}
	}, [])

	const emit = useCallback(function (name) {
		const args = Array.prototype.slice.apply(arguments);
		args.shift();
		if (_message[name]) {
			for (let i = 0; i < _message[name].length; i++) {
				_message[name][i].call(this, args);
			}
		}
	}, [])

	const remove = useCallback((name) => {
		if (_message[name]) {
			_message[name] = [];
		}
	}, [])
	
	return { on, emit, remove }
}


export { useEvent }

