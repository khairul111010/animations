import React from 'react'
import { ReactLenis } from 'lenis/react'
const Archive = () => {
    return (
        <>
            <ReactLenis root />
            <div className='container'>
                <div className="archive">
                    <img src="/img_1.jpg" alt="Image 1" />
                    <img src="/img_2.jpg" alt="Image 2" />
                    <img src="/img_3.jpg" alt="Image 3" />
                    <img src="/img_4.jpg" alt="Image 4" />
                </div>
            </div>
        </>
    )
}

export default Archive