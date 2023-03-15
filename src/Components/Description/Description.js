import React from "react";
import "./Description.css"

class Description extends React.Component {
    constructor(props){
        super(props);

        this.onUpdateDescription = this.onUpdateDescription.bind(this);
    }

    onUpdateDescription(e) {
        const desc = document.getElementById("desc").value;
        this.props.updateDescription(desc);

    }

    render(){
        return (
            <div className="Description">
                <textarea id="desc" onChange={this.onUpdateDescription}></textarea>
            </div>

        );
    }

}

export default Description;