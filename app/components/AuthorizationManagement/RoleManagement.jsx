/**
 Date: 2/26/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import ContentWrapper from "../Layout/ContentWrapper";
import ResourceEditor from "../Common/ResourceEditor/ResourceEditor";
import PropertyOption from "../Common/ResourceEditor/PropertyOption";

class RoleManagement extends React.Component {
    constructor(props) {
        super(props);


    }

    render() {
        let obj = {
            name: "wujunxian",
            birth: "0703",
            gender: "male",
            likeMusic: true,
            annotation: {a: "a", b: "b"}};
        let genderOption = new PropertyOption("gender", "性别", "select");
        genderOption.selections = [
            {label: "男", value: "male"},
            {label: "女", value: "female"}
        ];
        let options = [
            new PropertyOption("name", "姓名", "text"),
            new PropertyOption("birth", "生日", "text"),
            genderOption,
            new PropertyOption("likeMusic", "喜爱音乐", "boolean"),
            new PropertyOption("annotation", "注释", "keyValue")
        ];

        return (
            <ContentWrapper>
                <div className="content-heading">
                    角色管理
                </div>
                <ResourceEditor item={obj} resourceName={"人"} propertyOptions={options}/>
            </ContentWrapper>
        );
    }
}

export default RoleManagement;