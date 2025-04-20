import { useState } from "react";
import styles from "./NewsSnippet.module.scss";
import { NewsHeader } from "./NewsHeader";
import { HighlightOutlined, CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import cn from "classnames";
import { IData_SnippetNews } from "../types/interfaces";

export const NewsSnippet = (news: IData_SnippetNews) => {
    const [showAllKeywords, setShowAllKeywords] = useState(false);
    const [showAllPreview, setShowAllPreview] = useState(false);

    const showKeywords = () => {
        setShowAllKeywords(true);
    }

    const showPreview = () => {
        setShowAllPreview(!showAllPreview);
    }

    const markKeywords = () => {
        const raw = news.HIGHLIGHTS.join("; ");

        const str = raw.replace(/<(\/)?kw>/g, "");

        const kwArr = news.KW.map((el, key) => (key < news.KW.length - 1) ? el.value + "|" : el.value);
        const kwString = kwArr.join("");
        const regexp = new RegExp(kwString, "gi");

        const readyStr = str.replace(regexp, '<span style="background: #3d80cc; border-radius: 3px; padding: 1px 4px">$&</span>');

        return readyStr;
    }

    return (
        <article className={styles.newsContainer}>

            <NewsHeader {...news} />

            <div className={styles.newsMain}>
                <p 
                    className={cn({
                        [styles.newsPreview]: showAllPreview, 
                        [styles.newsPreviewHide]: !showAllPreview
                    })}
                    dangerouslySetInnerHTML={{__html:markKeywords()}}
                ></p>
                <button className={styles.newsMoreBtn} onClick={showPreview}>
                    {showAllPreview ? "Hide" : "Show more"} 
                    <span className={styles.newsMoreBtnIcon}>
                        {showAllPreview ? <CaretUpOutlined /> : <CaretDownOutlined />}
                    </span>
                </button>
            </div>
            
            <footer className={styles.newsFooter}>
                <div className={styles.newsKeywordContainer}>
                    {news.KW.length > 6 && !showAllKeywords ? 
                        <>
                        {news.KW.map((el, key) => 
                            key < 6 &&
                                <div className={styles.newsKeyword} key={el.value}>
                                    <span className={styles.newsKeywordIcon}><HighlightOutlined /> </span>
                                    <span className={styles.newsKeywordText}>{el.value}</span>
                                    <span className={styles.newsKeywordCount}>{el.count}</span>
                                </div>
                        )}
                        <button className={styles.newsKeywordMore} onClick={showKeywords}>Show All +{news.KW.length - 6}</button>
                        </>
                    
                        : 
                        news.KW.map(el => 
                            <div className={styles.newsKeyword} key={el.value}>
                                <span className={styles.newsKeywordIcon}><HighlightOutlined /> </span>
                                <span className={styles.newsKeywordText}>{el.value}</span>
                                <span className={styles.newsKeywordCount}>{el.count}</span>
                            </div>
                        )
                    }
                    
                </div>
                <a href={news.URL} className={styles.newsSourceLink}>Original Source</a>
            </footer>
        </article>
    );
};