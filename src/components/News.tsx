import { data } from "../assets/data.ts";
import { NewsSnippet } from "./NewsSnippet";
import { NewsHeader } from "./NewsHeader";
import styles from "./News.module.scss";
import { DownOutlined } from '@ant-design/icons';
import { useState } from "react";


export const News = () => {
    const [showDuplicates, setShowDuplicates] = useState(false);
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(0);

    const handleShowDuplicates = () => {
        setShowDuplicates(true);

        if(start === 0) {
            setStart(2)
            setEnd(10)
        } else if(start === 2) {
            setStart(10)
            setEnd(20)
        } else {
            setStart(start + 10)
            setEnd(end + 10)
        }
    }

    return (
        <>
            <div>
                <h1>News</h1>
                <div className={styles.wrapper}>
                    {data.map((el, key) => 
                        key === 0 &&
                        <div key={el.ID}>
                            <NewsSnippet {...el}/>
                            <div className={styles.dataInfo}>
                                <div className={styles.duplicatesCount}>
                                    Duplicates: {data.length - 1}
                                </div>
                                <div className={styles.dataSort}>
                                    <span className={styles.dataSortText}>By Relevance</span>
                                    <DownOutlined />
                                </div>
                            </div>
                        </div>
                    )}
                    {data.map((el, key) => 
                        key === 1 && 
                            <div key={el.ID}>
                                <div className={styles.headerContainer}>
                                    <NewsHeader {...el} />
                                </div>
                                {(data.length > 2 && !showDuplicates) &&
                                    <button 
                                        className={styles.duplicatesBtn}
                                        onClick={handleShowDuplicates}
                                    >
                                        <DownOutlined />
                                        <span className={styles.duplicatesBtnText}>
                                            View Duplicates
                                        </span>
                                    </button>
                                }
                                {(data.length > 2 && showDuplicates) &&
                                    <>
                                    {data.map((el, key) =>
                                        (key >= start && key <= end) && 
                                            <div className={styles.headerContainer} key={el.ID}>
                                                <NewsHeader {...el} />
                                            </div>
                                    )}
                                    {end < data.length -1 &&
                                        <button 
                                            className={styles.duplicatesBtn}
                                            onClick={handleShowDuplicates}
                                        >
                                            <DownOutlined />
                                            <span className={styles.duplicatesBtnText}>
                                                View Duplicates
                                            </span>
                                        </button>
                                    }
                                    </>
                                }
                            </div>
                    )}
                </div>
            </div>
        </>
    )
}