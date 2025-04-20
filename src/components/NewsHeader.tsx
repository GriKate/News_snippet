import styles from "./NewsHeader.module.scss";
import { IData_SnippetNews } from "../types/interfaces";
import { GlobalOutlined, ReadOutlined, UserOutlined, FlagOutlined } from '@ant-design/icons';
import cn from "classnames";

export const NewsHeader = (news: IData_SnippetNews) => {

    const handleData = (stringDate: string) => {
        const date = new Date(stringDate);
        // console.log(date);
        const dateString = date.toString();
        const month = dateString.slice(dateString.indexOf(" ") + 1, dateString.indexOf(" ") + 4);
        return <>
            <b>{date.getDate()} </b>
            <span>{month} </span>
            <span>{date.getFullYear()}</span>
        </>;
    }

    return (
        <header className={styles.newsHeader}>
            <div className={styles.newsHeaderTop}>
                <div className={styles.newsHeaderTopContainer}>
                    {handleData(news.DP)}
                </div>
                {news.REACH &&
                    <div className={styles.newsHeaderTopContainer}>
                        <span>
                            <b>{news.REACH}</b> Reach
                        </span>
                    </div>
                }
                {news.TRAFFIC &&
                    <div className={styles.newsHeaderTopContainer}>
                        <span>
                            Top Traffic: {news.TRAFFIC.map((el, key) => 
                                <span key={key}>
                                    {el.value} <b>{Math.round(el.count *100)}% </b>
                                </span>
                            )}
                        </span>
                    </div>
                }
            </div>
            <a href={news.URL} className={styles.newsLink}>
                <h3 className={styles.newsHeaderText}>{news.TI}</h3>
            </a>
            <div className={styles.newsHeaderBottom}>
                {news.DOM &&
                    <div className={styles.newsHeaderBottomContainer}>
                        <span className={styles.newsDomLinkIcon}><GlobalOutlined /></span>
                        <a href={"https://" + news.DOM} className={styles.newsDomLink}> {news.DOM}</a>
                    </div>
                }
                {news.CNTR &&
                    <div className={styles.newsHeaderBottomContainer}>
                        <span className={styles.newsCountryIcon}><FlagOutlined /></span>
                        <span className={styles.newsCountryName}> {news.CNTR}</span>
                    </div>
                }
                {news.LANG &&
                    <div className={styles.newsHeaderBottomContainer}>
                        <span className={styles.newsLanguageIcon}><ReadOutlined /> </span>
                        <span className={styles.newsLanguageName}>
                                {news.LANG[0].toUpperCase() + news.LANG.slice(1)}
                        </span>
                    </div>
                }
                {news.AU.length > 0 &&
                    <div className={styles.newsHeaderBottomContainer}>
                        <span className={styles.newsAuthorIcon}><UserOutlined /> </span>
                        <span className={styles.newsAuthorName}>
                            {news.AU.map((el, key) => (key < news.AU.length - 1) ? el + ", " : el)}
                        </span>
                    </div>
                }
            </div>
            <div className={styles.newsSentiment}>
                {news.SENT &&
                    <span 
                    className={cn({
                        [styles.newsSentimentPositive]: news.SENT === "positive", 
                        [styles.newsSentimentNegative]: news.SENT === "negative"
                    })}
                    >
                        {news.SENT[0].toUpperCase() + news.SENT.slice(1)}
                    </span>
                }
                <div className={styles.newsSentimentInfo}>i</div>
                <div className={styles.newsSentimentInfo}></div>
            </div>
        </header>
    );
}