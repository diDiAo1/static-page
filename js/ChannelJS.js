
var ChannelObj = null; //渠道对象

function ChannelInit() {
    var channelOption = { strPageIndex: 1,
        strPageCount: 10,
        strDataCount: 0,
        strServletLocation: ""
    };

    ChannelObj = new pagingObject(channelOption);
    //初始化数据
    DataPushChannel(ChannelObj.FirstPage("&channelType=1"));

    //首页
    $(".cusPaging .firstPage").click(function () {
        DataPushChannel(ChannelObj.FirstPage("&channelType=" + $("#channel .active").attr("cusType")));
    });
    //上一页
    $(".cusPaging .previousPage").click(function () {
        DataPushChannel(ChannelObj.PreviousPage("&channelType=" + $("#channel .active").attr("cusType")));
    });
    //下一页
    $(".cusPaging .nextPage").click(function () {
        DataPushChannel(ChannelObj.NextPage("&channelType=" + $("#channel .active").attr("cusType")));
    });
    //尾页
    $(".cusPaging .endPage").click(function () {
        DataPushChannel(ChannelObj.EndPage("&channelType=" + $("#channel .active").attr("cusType")));
    });
    //删除
    $(".cusDel").click(function () {
        if ($(".cusListTr .cusSelect").length > 0) {
            ChannelObj.DelEntity($(".cusListTr .cusSelect").attr("rel"), DataPushChannel(ChannelObj.FirstPage("&channelType=" + $("#channel .active").attr("cusType"))), "&channelType=" + $("#channel .active").attr("cusType"));
        }
    });
    //新增
    $(".cusAdd").click(function () {
        $("#lbl_channelId").html("");$("#txt_channelName").val("");
        $("#ddl_channelLevel").val("");$("#txt_channelPhone").val("");
        $("#ddl_channelIndustries").val("");$("#txt_channelOrgName").val("");
        $("#txt_channelCreateTime").val("");$("#txt_channelPosition").val("");
        $("#txt_channelBirth").val("");$("#txt_homeAddress").val("");
        $("#txt_companyAddress").val("");$("#txt_hometownAddress").val("");
        $("#txt_channelHobby").text("");$("#txt_channelFamilySituation").val("");
        $("#ddl_dailyStrategy").val("");
    });
    //编辑
    $(".cusEdi").click(function () {
        EntityInitForChannelEdit();
    });

    $(".cusView").click(function () {
        if ($(".cusListTr .cusSelect").length > 0) {
            ChannelObj.DelEntity($(".cusListTr .cusSelect").attr("rel"));
        }
    });
}

//将得到的数据变成html格式代码字符串
var DataPushChannel = function (data) {
    var str = "";
    for (var i = 1; i <= data.List.length; i++) {
        str += "<tr class='cusListTr' rel='" + data.Id + "'>";
        str += "<td>" + data.Name + "</td>";
        str += "<td>" + data.level + "</td>";
        str += "<td>" + data.industries + "</td>";
        str += "<td>" + data.ChannelAddress + "</td>";
        str += "<td>" + data.createTime + "</td>";
        str += "<td>" + data.orgName + "</td>";
        str += "<td>" + data.position + "</td>";
        str += "<td>" + data.phone + "</td>";
        str += "</tr>";
    }
    $(".cusList tbody").html(str);

    $(".cusPaging .pageIndex").text(ChannelObj.strPageIndex);
    $(".cusPaging .pageCount").text(ChannelObj.strPageCount);
    $(".cusPaging .dataCount").text(ChannelObj.strDataCount);
}


//查看页面初始化
var EntityInitForChannelEdit = function () {
    if ($(".cusListTr .cusSelect").length > 0) {
        var entity = ChannelObj.GetEntity($(".cusListTr .cusSelect").attr("rel"), 1);
        $("#lbl_channelId").html(entity.Id);
        $("#txt_channelName").val(entity.Name);
        $("#ddl_channelLevel").val(entity.Level);
        $("#txt_channelPhone").val(entity.Phone);
        $("#ddl_channelIndustries").val(entity.Industries);
        $("#txt_channelOrgName").val(entity.OrgName);
        $("#txt_channelCreateTime").val(entity.ChannelCreaTime);
        $("#txt_channelPosition").val(entity.Position);
        $("#txt_channelBirth").val(entity.birth);
        $("#txt_homeAddress").val(entity.homeAddress);
        $("#txt_companyAddress").val(entity.companyAddress);
        $("#txt_hometownAddress").val(entity.hometownAddress);
        $("#txt_channelHobby").text(entity.hobby);
        $("#txt_channelFamilySituation").val(entity.familySituation);
        $("#ddl_dailyStrategy").val(entity.dailyStrategy);
        //节日策略赋值未完成
    }
}

//编辑页面群组列表初始化
var SaveChannel = function () {
    var Id = $("#lbl_channelId").html();
    var Name = $("#txt_channelName").val();
    var Level = $("#ddl_channelLevel").val();
    var Phone = $("#txt_channelPhone").val();
    var Industries = $("#ddl_channelIndustries").val();
    var OrgName = $("#txt_channelOrgName").val();
    var ChannelCreaTime = $("#txt_channelCreateTime").val();
    var Position = $("#txt_channelPosition").val();
    var Birth = $("#txt_channelBirth").val();
    var HomeAddress = $("#txt_homeAddress").val();
    var CompanyAddress = $("#txt_companyAddress").val();
    var HometownAddress = $("#txt_hometownAddress").val();
    var Hobby = $("#txt_channelHobby").text();
    var FamilySituation = $("#txt_channelFamilySituation").val();
    var DailyStrategy = $("#ddl_dailyStrategy").val();
    var FestivalStrategy = "";

    $("input[name='strategy']").each(function () {
        if (this.checked) {
            FestivalStrategy += $(this).val() + "|";
        }
    });

    if (Name.length < 1) {
        confirmShow(0, "", "请填写客户名！", "消息提示");
        return false;
    }

    $.ajax({
        type: "post",
        url: ChannelObj.strServletLocation + "?methodName=Edit&Id=" + Id +
        "&Name=" + Name + "&Level=" + Level + "&Phone=" + Phone + "&Industries=" + Industries + "&OrgName=" + OrgName +
        "&ChannelCreaTime=" + ChannelCreaTime + "&Position=" + Position + "&Birth=" + Birth + "&HomeAddress" + HomeAddress +
        "&CompanyAddress=" + CompanyAddress + "&HometownAddress=" + HometownAddress + "&Hobby=" + Hobby +
        "&FamilySituation=" + FamilySituation + "&DailyStrategy=" + DailyStrategy, //+"&"+ 节日策略赋值未完成,
        dataType: "json",
        async: false,
        success: function (r) {
            if (r == "false") {
                confirmShow(0, "", "保存成功！", "消息提示");
            }
            else if (r == "sessionOut") {
                doLogout();
            }
            else {
                confirmShow(0, "", "保存失败！", "消息提示");
            }
        },
        error: function (e) {
            alert(e.responseText);
        }
    });
}
