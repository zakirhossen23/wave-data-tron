
import React, { useEffect } from "react";

import Header from '../../components/layout/Header'
import './faq.css'
export default function FAQ() {

    function SetEventListener() {
        const faqTag = document.querySelectorAll('.faq');

        // Hide other elements and change icon.
        const hideTag = () => {
            faqTag.forEach(item => {
                item.classList.remove('open')
                item.children[1].innerHTML = '&#43;'
            })
        }

        // Toggle targeted element to show with froEach Loop.
        faqTag.forEach(item => {
            item.addEventListener('click', e => {
                if (e.target.className == 'faq-btn btn') {
                    hideTag()
                    e.target.parentElement.classList.toggle('open');
                    e.target.innerHTML = '&#8722;';
                }
            })
        })
        return <></>;
    }
    useEffect(() => {
        SetEventListener();
    }, []);

    return (
        <>
            <>
                <Header />
                <h1 className='text-center'>Frequently Asked Questions</h1>
                <div style={{ padding: "0 5%" }}>
                    <div className="faq">
                        {/* FAQ 1 */}
                        <div className="faq_text">
                            <h2>How can I get paid?</h2>
                            <p>
                                You will be paid by PayPal.
                            </p>
                        </div>
                        <span className="faq-btn btn">+</span>
                    </div>
                    {/* FAQ 1 End */}
                    <div className="faq ">
                        {/* FAQ 2 */}
                        <div className="faq_text">
                            <h2>How can I get money?</h2>
                            <p>
                                You can share your details
                            </p>
                        </div>
                        <span className="faq-btn btn">+</span>
                    </div>
                    {/* FAQ 2 End */}
                    <div className="faq">
                        {/* FAQ 3 */}
                        <div className="faq_text">
                            <h2>How can I finish a survey or trial?</h2>
                            <p>
                                You have to download an app. And finish all the task.
                            </p>
                        </div>
                        <span className="faq-btn btn">+</span>
                    </div>
                    {/* FAQ 3 End */}
                </div>

            </>
            <SetEventListener />
        </>
    )

}