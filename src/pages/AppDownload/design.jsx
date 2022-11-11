
export default function DesignApp() {
  return (
    <>
      <div id="top" />
      {/* /.parallax full screen background image */}
      <div
        className="fullscreen landing parallax"
        style={{ backgroundImage: 'url("./images/bg.jpg")' }}
        data-img-width={2000}
        data-img-height={1325}
        data-diff={100}
      >
        <div className="overlay">
          <div className="container mr-auto ml-auto pl-4 pr-4">
            <div className="row -ml-4 -mr-4 flex">
              <div className="col-md-6 relative pl-4 pr-4 w-6/12">
                {/* /.main title */}
                <h1 className="wow fadeInRight">Download App</h1>
                {/* /.header paragraph */}
                <div className="landing-text wow fadeInRight">
                  <p>
                    By sharing your Data you can help finding a cure and be a part of of the solution!
                    You at all times keep control of your data and decide who can see it and use it for research.
                  </p>
                </div>
                {/* /.header button */}
                <div className="head-btn wow fadeInRight">
                  <a href="#download" className="btn-primary">
                    Download
                  </a>
                  
                </div>
                {/* /.phone option */}
                <div className="more wow fadeInRight">
                  <p>
                    Available for:
                    <a href="#download" className="btn option">
                      <i className="fa fa-apple" />
                      iOS
                    </a>
                    <a href="#download" className="btn option">
                      <i className="fa fa-android" />
                      Android
                    </a>
                  </p>
                </div>
              </div>
              {/* /.phone image */}
              <div className="w-6/12 relative pl-4 flex pr-4 justify-end">
                <img
                  src={require("./images/header-phone.png")}
                  alt="phone"
                  className="header-phone img-responsive visible block max-w-full align-middle h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
  
      {/* /.intro section */}
      <div id="intro">
        <div className="container mr-auto ml-auto pl-4 pr-4">
          <div className="row -ml-4 -mr-4">
            {/* /.intro content */}
            <div className="col-md-12 w-full">
              <h2>Well performed best app of the year</h2>
              <p>
                Lorem Ipsum is simply dummy text of the <strong>printing</strong>{" "}
                and typesetting industry. Lorem Ipsum has been the industry's
                standard dummy text ever since the 1500s, when an unknown printer
                took a galley of type and scrambled it to make a type specimen book.
                It has survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing.
              </p>
              <div className="btn-section">
                <a href="/faq" className="btn-default">
                  Read More
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    
    
    </>

  )
} 
