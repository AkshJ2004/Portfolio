import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Full Stack Developer Intern</h4>
                <h5>PaySecure</h5>
              </div>
              <h3></h3>
            </div>
            <p>
              Increased backend test coverage to 66% using Jest. Refactored Node.js and Express REST APIs to reduce average response times by 10%. Developed responsive React dashboards and collaborated in Agile sprint planning.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>B.Tech in Computer Science</h4>
                <h5>Vellore Institute of Technology</h5>
              </div>
              <h3></h3>
            </div>
            <p>
             Strong foundation in Data Structures & Algorithms, Object-Oriented Programming and Database Management Systems.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Certifications & Achievements</h4>
                <h5>Various</h5>
              </div>
              <h3></h3>
            </div>
            <p>
              MongoDB Certified Associate Developer (2025). Adobe India Hackathon Semi-Finalist. National Mathematics Talent Contest Winner. Solved 164+ DSA problems on LeetCode.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
