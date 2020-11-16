import React from "react";

const TravelStep = ({data, index}) => {
    console.log('data', data)
    return (
        <div className="card px-4 pt-4 my-4 bg-light">
            <div className="row">
                <div className="col-sm-8">
                    <h3 className="mb-3">
                    {data.show_step_number &&
                        <span className="text-secondary pr-3">
                        Step {index + 1}
                        </span>
                    }
                    {data.title.text}
                    </h3>
                    <div dangerouslySetInnerHTML={{ __html: data.content.html }}></div>
                </div>
                <div className="col-sm-4">
                    {data.action_link &&
                        <p className="text-center">
                        <a
                            href={data.action_link}
                            className="btn btn-primary my-4 px-4"
                            target={data.action_new_window ? '_blank' : '' }
                        >
                            {data.action_title.text}
                        </a>
                        </p>
                    }
                </div>
            </div>
        </div>
    )
}

export default TravelStep;