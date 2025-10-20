import React from "react";

const CatalogComponent = () => {
    return (
        <div>
            <div className='catalog_content'>
                <div>All Sets created in Catalog gets displayed here. Checkout the <a href="https://www.youtube.com/watch?v=07vdgqGcU50" target="_blank" className='catalog_tutorial_link' color="#0E71C3"><div className="watch-tutorial-content"><svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="13.5" cy="13.5" r="13.5" fill="#0E71C3"></circle><path d="M17.8691 12.6344C18.5358 13.0193 18.5358 13.9815 17.8691 14.3664L12.0648 17.7176C11.3981 18.1025 10.5648 17.6214 10.5648 16.8516L10.5648 10.1493C10.5648 9.37948 11.3981 8.89836 12.0648 9.28326L17.8691 12.6344Z" fill="white"></path></svg><span >Video</span></div></a> to learn how to create Sets in Meta Catalog.</div>
                <p>Note: Maximum of 30 items in a Set gets sent when a Set Catalog message is delivered to user.</p>
            </div>
            <div className='materials__action__item'>
                <div className='action__item__'>
                    <div className='material__list__nocontent'>
                        <img alt="No data" src="https://live-6053.wati.io/static/media/no_data.f7f1c72cf9ac99dfe00aa267dbd7928f.svg" />
                        <span className="nocontent__title">Catalog empty</span>
                        <span className="nocontent__text"><div>Visit <a href="https://live-6053.wati.io/catalog">Catalog setup page</a> to enable Catalog with WATI</div></span>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default CatalogComponent;