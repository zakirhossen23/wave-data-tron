import React from 'react';
import Header from '../../components/layout/Header'
export default function AboutUs() {
    return (
        <>
            <Header />
            <div className="--section w-full min-h-screen bg-gray-300">
                <div className="--container w-4/5 block m-auto pt-24">
                    <div className="--content-section float-left w-6/12">
                        <div className="--title uppercase text-3xl">
                            <h1>About Us</h1>
                        </div>
                        <div className="--content">
                            <h3 className='mt-5 text-gray-700 text-xl'>Lorem ipsum dolor sit amet, consectetur adipisicing</h3>
                            <p className='mt-2 text-lg leading-normal'>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat.
                            </p>
                            <div className="--button mt-8">
                                <a className='bg-gray-800 text-white text-2xl no-underline pb-3 pl-10 pt-3 pr-10 hover:bg-red-800 hover:text-white' href="/privacy">Read More</a>
                            </div>
                        </div>
               
                    </div>
                    <div className="--image-section float-right w-2/5 bg-white">
                        <img className='w-full h-auto' src="/favicon.ico" />
                    </div>
                </div>
            </div>

        </>
    )

}