import { useState } from 'react';
import styles from "./HighlightedTextarea.module.scss";
import { data } from "../../assets/data.ts";
import DOMPurify from 'dompurify';
// import { Remarkable } from "remarkable";

export const HighlightedTextarea = () => {
    // строка для поиска
    const [searchText, setSearchText] = useState("");
    // строка с разметкой
    const [output, setOutput] = useState("");

    const handleInput = async (target: EventTarget & HTMLDivElement) => {
        const rawStr = target.textContent;

        if (rawStr) {
            await createMarkup(rawStr); 
        }

        lastCursorPosition();
    }

    // const rmOutput = () => {
    //     const md = new Remarkable();
    //     md.set({
    //         html: true,
    //         breaks: true,
    //         typographer: true
    //     });
    //     const markdown = (md.render(output));
    //     return {__html: markdown};
    // }

    const createMarkup = (rawStr: string) => {
        const cleanStr = DOMPurify.sanitize(rawStr);
        setSearchText(cleanStr);
        
        let newStr = cleanStr;

        const keys = Object.keys(data[0]);
        const logWords = ["OR", "AND", "NOT"];

        if (newStr.includes("=")) {
            // подсвечивать кавычки внутри!
            const valueRegExp = new RegExp(/([A-Z]+)(=[“”"])([^“”"]*([“”"][^“”"\s]*[“”"])*[^“”"]*)*?([“”"])((\s*[A-Z]{2,}=[“”"])|\s*|\s*[A-Z]{2,})/g);
            newStr = newStr.replace(valueRegExp, '$1$2<span style="color: purple">$3</span>$5$6');

            keys.map(key => {
            const keyRegExp = new RegExp("(\\b" + key + ")(=)", "g");
            newStr = newStr.replace(keyRegExp, '<span style="color: #3d80cc">$1</span>$2');
        })
        } else {
            const valueRegExp = new RegExp(/([“”"])(([^“”"]*?([“”"]([^“”"\s])*[“”"])*)*?)([“”"])/g);
            newStr = newStr.replace(valueRegExp, '$1<span style="color: purple">$2</span>$6');
        }

        logWords.map(logword => {
            const regexpStr = "(\\b" + logword + "\\b)(\\s)";
            const LWRegExp = new RegExp(regexpStr, "g");
            newStr = newStr.replace(LWRegExp, '<span style="color: #f83a59">$1</span>$2');
        })

        setOutput(newStr);
    }

    const lastCursorPosition = () => {
        const selection = window.getSelection()!; 
        const range = selection.getRangeAt(0);  // берем первый диапазон выбора
        const parentNode = range.startContainer;
        
        const offset = range.startOffset;

        let totalLength = 0;
        parentNode.childNodes.forEach( childNode => {
            if (childNode.textContent!.length) {
                totalLength += childNode.textContent!.length;
            }
        })

        totalLength = totalLength + offset;

        setCursorPosition(selection, parentNode, totalLength);
    }

    const setCursorPosition = (selection: Selection, parentNode: Node, totalLength: number) => {

        const newRange = document.createRange();
        let charIndex = 0;
        let isTargetFound = false;

        parentNode.childNodes.forEach( (childNode, idx) => {

            if (charIndex <= totalLength) {

                if (totalLength >= charIndex && totalLength <= charIndex + childNode.textContent!.length) {
                    // newRange.setStart(childNode, totalLength - charIndex)
                    newRange.setStart(parentNode.childNodes[idx], totalLength - charIndex);
                    newRange.collapse(true);
                    isTargetFound = true;
                }
                charIndex += childNode.textContent!.length;
            }
        })

        if (isTargetFound) {
            selection.removeAllRanges();
            selection.addRange(newRange);
        }
    }

    return (
        <>
            <h3>Search</h3>
            <div className={styles.wrapper}>

                <div className={styles.areaContainer}>
                    <div 
                        contentEditable="true" 
                        className={styles.placeholderContent} 
                        id="placeholderContent" 
                        onInput={e => handleInput(e.currentTarget)}
                        dangerouslySetInnerHTML={{__html: output}} 
                    >
                    </div>
                </div>

                <input 
                type="button" 
                className={styles.searchBtn} 
                onClick={() => alert(`Search query ${searchText} is sent`)} value="Search" />
            </div>
        </>
    )
}