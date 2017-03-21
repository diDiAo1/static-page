var projectLocation = "./";

		// echar图形路径配置
		require.config({
			paths: {
				echarts: 'build/dist/echarts',
				'echarts/chart/pie': 'build/dist/chart/pie',
				'echarts/chart/funnel': 'build/dist/chart/funnel',
				'echarts/chart/line': 'build/dist/chart/line',
				'echarts/chart/bar': 'build/dist/chart/bar'
			}
		});


$(function () {

	$('.datepickers').datepicker({});

    var contentHeight = $(window).height() - 195;
    //管理以外页面高度
    $(".box-content").css("height", contentHeight);
    //管理的组织树页面高度
    $(".box-contentCou").css("height", contentHeight);
    //管理的组织树右边页面高度
    $(".strategy-tab").css("height", contentHeight);

	funnelMap();

    //窗口大小改变的事件
    $(window).resize(function () {
        //process here
        var contentHeight = $(window).height() - 200;
        var treeConTent = $(window).height() - 195;
        //管理以外页面高度
        $(".box-content").css("height", contentHeight);
        //管理的组织树页面高度
        $(".box-contentCou").css("height", treeConTent);
        //管理的组织树右边页面高度
        $(".strategy-tab").css("height", treeConTent);
    });

    // for 导航文字切换
    /*$('.main-menu a').on('shown.bs.tab', function (e) {
    // 获取已激活的标签页的名称
    var activeTab = $(e.target).text() + "列表"; 
    $(".well h2 span").html(activeTab);
    });*/

    //设置面包屑导航的text
    setMenuTxt();
    $(".cusList").find("td").each(function () { $(this).addClass("cusListTd") });
    $(".proList").find("td").each(function () { $(this).addClass("cusListTd") });
    $(".notSendList").find("td").each(function () { $(this).addClass("cusListTd") });
    $(".panoramaList").find("td").each(function () { $(this).addClass("cusListTd") });
    $(".normalList").find("td").each(function () { $(this).addClass("cusListTd") });

	//登陆按钮压下事件
	$("#loginBtn").click(function(){
		$("#loginCon").css("display","none");
		$("#saleContent").css("display","block");
	});

    //渠道模块的左侧菜单
    $('#channel a').click(function (e) {
        $("#customerList").show();
        $("#customerList").siblings().hide();
        $(this).parent("li").addClass("active");
        $(this).parent("li").siblings().removeClass("active");
        var txt = $(this).children("span").text();
        setMenuTxt();
        var str = txt + "列表";
        $(".well h2 span").html(str);
    });

    //漏斗模块的左侧菜单
    $("#funnel a").click(function () {
        $("#projectList").show();
        $("#projectList").siblings().hide();
        $(this).parent("li").addClass("active");
        $(this).parent("li").siblings().removeClass("active");
        var txt = $(this).children("span").text();
        setMenuTxt();
        var str = txt + "项目列表";
        $(".well h2 span").html(str);
    });

    $('#strategyMenu a').click(function () {
        var target = $(this).parent("li").attr("rel");
        $("#" + target).show();
        $("#" + target).siblings().hide();
        var txt = $(this).children("span").text();
        setMenuTxt(txt);
    });

    //任务模块的左侧菜单

    //top导航点击切换
    $(".top-menu a").click(function () {
        //  alert(123);
        //设置左侧导航的轮换
        var target = $(this).attr("rel");
        $("#" + target).siblings().removeClass("active");
        $("#" + target).addClass("active");
        //设置top导航的选择色
        $(this).parent("li").addClass("active");
        $(this).parent("li").siblings().removeClass("active");
        //设置导航面包屑
        setMenuTxt();
        if (target == "funnel") {
            $("#funnelCon").show();
            $("#funnelCon").siblings(".row").hide();
            //top导航点击回到初始状态
            $("#" + target).find("li").removeClass("active");
            //展示漏斗图
            funnelMap();
        }
        else if (target == "channel") {
            $("#customerList").show();
            $("#customerList").siblings(".row").hide();
        }
        else if (target == "task") {
            $("#planBacklog").show();
            $("#planBacklog").siblings(".row").hide();
        }
        else if (target == "management") {
            //管理的第一个页面显示，其他隐藏
            $("#ManagementChannel").show();
            $("#ManagementChannel").siblings(".row").hide();
        }
		else if (target == "setUp")
		{
            //设置的第一个页面显示，其他隐藏
            $("#unitCon").show();
            $("#unitCon").siblings(".row").hide();
			$("#setUpChildMenu").slideDown();
		}

    });


    //任务左侧导航点击
    $("#task li").click(function () {
        var target = $(this).attr("rel");
        if (typeof (target) != "undefined") {
            $("#" + target).show();
            $("#" + target).siblings(".row").hide();
        }
        $(this).addClass("active");
        $(this).siblings().removeClass("active");

        setMenuTxt();

    });

    //管理左侧导航点击
    $(".management").click(function () {
        var target = $(this).parent("li").attr("rel");
        if (typeof (target) != "undefined") {
            $("#" + target).show();
            $("#" + target).siblings(".row").hide();
        }
        if (target == "Managementfunnel") {
            funnelManageMap();
        }
        else if (target == "ManagementCount") {
            if ($("#childMenu").is(":hidden")) {
                $("#childMenu").slideDown();
            }
            else {
                $("#childMenu").slideUp();
            }
        }
        if (target != "ManagementCount") {
            $("#childMenu").slideUp();
        }
        $("#management li").siblings().removeClass("active");
        $(this).parent("li").addClass("active");
        setMenuTxt();
    });

    $("#childMenu li").click(function (e) {
        //设置选择色
        $(this).addClass("active");
        $(this).siblings().removeClass("active");
        var txt = $(this).children("a").children("span").text();
        setMenuTxt(txt);
        //设置应该显示类容
        var childTarget = $(this).attr("rel");
        $("#" + childTarget).show();
        $("#" + childTarget).siblings(".row").hide();
        if (childTarget == "businessCon") {
            //行业类型饼图
            industryDonePie();
            //项目类型饼图
            projectDonePie();
            //规模类型饼图
            scaleDonePie();
        }
        else if (childTarget == "taskStructureCon") {
            //分类耗费占比饼图
            classifyCostPie();
        }

        //阻止冒泡
        e.stopPropagation();
    });


	//设置左侧导航点击
    $(".setUpMenu").click(function () {
        var target = $(this).parent("li").attr("rel");
        if (typeof (target) != "undefined") {
            $("#" + target).show();
            $("#" + target).siblings(".row").hide();
        }
        if (target == "setUpOrgan") {
            if ($("#setUpChildMenu").is(":hidden")) {
                $("#setUpChildMenu").slideDown();

            }
            else {
                $("#setUpChildMenu").slideUp();
            }
        }
        if (target != "setUpOrgan") {
            $("#setUpChildMenu").slideUp();
        }
        $("#setUp li").siblings().removeClass("active");
        $(this).parent("li").addClass("active");
        setMenuTxt();
    });

    $("#setUpChildMenu li").click(function (e) {
        //设置选择色
        $(this).addClass("active");
        $(this).siblings().removeClass("active");
        var txt = $(this).children("a").children("span").text();
        setMenuTxt(txt);
        //设置应该显示类容
        var childTarget = $(this).attr("rel");
        $("#" + childTarget).show();
        $("#" + childTarget).siblings(".row").hide();

        //阻止冒泡
        e.stopPropagation();
    });

    //点击客户表格行选中
    $(".cusListTr").click(function () {
        if ($(this).hasClass("cusSelect")) {
            $(this).css("background-color", "");
            $(this).css("color", "#000000");
            $(this).removeClass("cusSelect");
        }
        else {
            $(this).css("background-color", "#2dc3e8");
            $(this).css("color", "#ffffff");
			$(this).siblings().css("background-color", "");
			$(this).siblings().css("color", "#000000");
			$(this).siblings().removeClass("cusSelect");
			$(this).addClass("cusSelect");
        }
    });

	
    /* 待定 点击空白 选择色去掉*/
    $(document).click(function (e) {
        e = window.event || e; // 兼容IE7
        obj = $(e.target).attr("class");
        if (obj != "cusListTd") {
            $(".cusListTr").css("background-color", "");
            $(".cusListTr").css("color", "#000000");
            $(".cusListTr").removeClass("cusSelect");
        }

        if (obj != "form-control textAble") {
            $(".textAble").css("height", "34px");
        }

		if (obj != "panoramaNo cusListTd panoramaSelect")
		{
            $(".panoramaNo").css("background-color", "");
            $(".panoramaNo").css("color", "#000000");
            $(".panoramaNo").removeClass("cusSelect");
		}
    });

    //策略按钮click
    /* var i = 1;
    $(".btnStrategy").click(function(){
    //显示日历
    $("#calendarShow").show();
    if (i == 1)
    {
    calendarContent();
    i = 0;
    }
    $("#customerList").hide();
    })*/

    //客户列表策略按钮click
    $(".btnStrategy").click(function () {
        //改变左侧导航
        $("#strategyMenu").siblings().removeClass("active");
        $("#strategyMenu").addClass("active");
        setMenuTxt("日常策略");
        $("#strategy").show();
        $("#customerList").hide();
    });

    //客户列表删除按钮
    $(".cusDel").click(function () {
        if (!$(".cusListTr").hasClass("cusSelect")) {
            confirmShow(0, "", "请先在列表中选择一个客户。", "消息提示");
            return;
        }
        confirmShow(0, "", "确定删除吗？删除请点击确定按钮。", "消息提示");
        $(".cancelHide").show();
    });

    //客户列表编辑按钮
    $(".cusEdi").click(function () {
		//actionShow("成功");
        if ($(".cusListTr").hasClass("cusSelect")) {
            $("#customerDetail").show();
            $("#customerList").hide();
        }
        else {
            confirmShow(0, "", "请先在列表中选择一个客户。", "消息提示");
        }
    });

    //客户列表查看按钮
    $(".cusView").click(function () {
        if ($(".cusListTr").hasClass("cusSelect")) {
            $("#customerView").show();
            $("#customerList").hide();
            $(".cusViewBtn").attr("rel", "projectList");
        }
        else {
            confirmShow(0, "", "请先在列表中选择一个客户。", "消息提示");
        }
    });

    $(".manCusView").click(function () {
        $("#customerView").show();
        $("#customerList").hide();
        $(".cusViewBtn").attr("rel", "ManagementChannel");
    });

    //客户列表新增按钮
    $(".cusAdd").click(function () {
        $("#customerDetail").show();
        $("#customerList").hide();
    });

    //客户列表来往按钮
    $(".cusCon").click(function () {
        $("#contact").show();
        $("#customerList").hide();
    });


    //客户编辑的返回按钮
    $(".backList").click(function () {
        $("#customerDetail").hide();
        $("#customerList").show();
    });

    //客户列表的导出按钮
    $("#exportFirst").click(function () {
        exportShow("exportShow");
    });

    //设置客户列表表格排序
    $(".cusList").tablesorter({
        sortList: [[0, 0]], widgets: ['zebra'], headers: { 4: { sorter: false }, 5: { sorter: false }, 6: { sorter: false} }
    });

    // 设置日常策略列表表格排序
    $(".strList").tablesorter({
        sortList: [[0, 0]], widgets: ['zebra'], headers: { 5: { sorter: false }, 6: { sorter: false} }
    });

    //设置项目列表表格排序
    $(".proList").tablesorter({
        sortList: [[0, 0]], widgets: ['zebra'], headers: { 5: { sorter: false} }
    });

    //策略列表的返回按钮
    $(".straBack").click(function () {
        $("#customerList").show();
        $("#customerList").siblings().hide();
        setMenuTxt();
    });

    // 来往信息页面返回按钮
    $(".btnConBack").click(function () {
        var targetRel = $(this).attr("rel");
        $(".row").hide();
        $("#" + targetRel).show();
    });

    //策略列表的编辑按钮
    $("#straEdit").click(function () {
        $("#strategyEdit").show();
        $("#strategy").hide();
    });

    //策略左侧select部分的click事件
    $("#mu-selected option").click(function () {
        var text = $("#mu-selected").find("option:selected").text();
        var val = $("#mu-selected").val();
        $(this).css("display", "none");
        // ajax动态刷新时直接追加删除
        // 有后台数据时 等删除
        $("#ms-selectable option").each(function () {
            if ($(this).val() == val) {
                $(this).css("display", "block");
            }
        });
    });
    //策略右侧select部分的click事件
    $("#ms-selectable option").click(function () {
        var text = $("#ms-selectable").find("option:selected").text();
        var val = $("#ms-selectable").val();
        //$(this).remove();
        //$("#mu-selected").append("<option value="+val+">"+text+"</option>");
        $(this).css("display", "none");
        // ajax动态刷新时直接追加删除
        // 有后台数据时 等删除
        $("#mu-selected option").each(function () {
            if ($(this).val() == val) {
                $(this).css("display", "block");
            }
        });
    });


	    //角色左侧select部分的click事件
    $("#leftRoleSel option").click(function () {
        var text = $("#leftRoleSel").find("option:selected").text();
        var val = $("#leftRoleSel").val();
        $(this).css("display", "none");
        // ajax动态刷新时直接追加删除
        // 有后台数据时 等删除
        $("#rightRoleSel option").each(function () {
            if ($(this).val() == val) {
                $(this).css("display", "block");
            }
        });
    });
    //角色右侧select部分的click事件
    $("#rightRoleSel option").click(function () {
        var text = $("#rightRoleSel").find("option:selected").text();
        var val = $("#rightRoleSel").val();
        //$(this).remove();
        //$("#mu-selected").append("<option value="+val+">"+text+"</option>");
        $(this).css("display", "none");
        // ajax动态刷新时直接追加删除
        // 有后台数据时 等删除
        $("#leftRoleSel option").each(function () {
            if ($(this).val() == val) {
                $(this).css("display", "block");
            }
        });
    });

    //策略编辑返回按钮
    $(".btnStrBack").click(function () {
        $("#strategyEdit").hide();
        $("#strategy").show();
    });


    //漏斗类容
    //项目列表新增按钮
    $(".proAdd").click(function () {
        $("#projectDetail").show();
        $("#projectList").hide();
    });

    $("#exportPro").click(function () {
        exportShow("exportProShow");
    });

    //超期列表项目-延期按钮点击
    $(".prodel").click(function () {
        if ($(".cusListTr").hasClass("cusSelect")) {
            var targetRel = $(this).attr("rel");
            $(".row").hide();
            $("#" + targetRel).show();
        }
        else {
            confirmShow(0, "", "请先在列表中选择一个项目。", "消息提示");
        }

        // 光标锁定到获取时间文本框
        $("#getTime").focus();

        $("#projectDetail textarea").attr("disabled", true);
        $("#projectDetail select").attr("disabled", true);
        $("#projectDetail input:not(.timeEdit)").attr("disabled", true);

        if ($(this).hasClass("backlog")) {
            //改变返回button的rel指向任务-待办-项目超期
            $(".proDetail").attr("rel", "planBacklog");
        }
        else {
            //改变返回button的rel指向超期界面
            $(".proDetail").attr("rel", "projectOverTime");
        }

    });

    //超期列表项目-进阶按钮点击
    $(".proAdva").click(function () {
        if ($(".cusListTr").hasClass("cusSelect")) {
            var targetRel = $(this).attr("rel");
            $(".row").hide();
            $("#" + targetRel).show();
        }
        else {
            confirmShow(0, "", "请先在列表中选择一个项目。", "消息提示");
        }

        //改变返回button的rel指向超期列表项目
        $(".proAdvBack").attr("rel", "projectOverTime");

        if ($(this).hasClass("backlog")) {
            //改变返回button的rel指向任务-待办-项目超期
            $(".proAdvBack").attr("rel", "planBacklog");
        }
        else {
            //改变返回button的rel指向超期界面
            $(".proAdvBack").attr("rel", "projectOverTime");
        }
    });

    //超期列表项目-放弃按钮点击
    $(".proTras").click(function () {
        if ($(".cusListTr").hasClass("cusSelect")) {
            var targetRel = $(this).attr("rel");
            $(".row").hide();
            $("#" + targetRel).show();
        }
        else {
            confirmShow(0, "", "请先在列表中选择一个项目。", "消息提示");
        }

        if ($(this).hasClass("backlog")) {
            //改变返回button的rel指向任务-待办-项目超期
            $(".proTraBack").attr("rel", "planBacklog");
        }
        else {
            //改变返回button的rel指向超期界面
            $(".proTraBack").attr("rel", "projectOverTime");
        }
    });


    $(".befSel").click(function () {
        if ($(".cusListTr").hasClass("cusSelect")) {
            var targetRel = $(this).attr("rel");
            $(".row").hide();
            $("#" + targetRel).show();

            if (targetRel == "projectDetail") {
                $("#projectDetail textarea").attr("disabled", false);
                $("#projectDetail select").attr("disabled", false);
                $("#projectDetail input:not(.timeEdit)").attr("disabled", false);

                //改变返回button的rel指向项目列表界面
                $(".proDetail").attr("rel", "projectList");
            }
            else if (targetRel == "projectAdvanced") {
                //改变返回button的rel指向项目列表界面
                $(".proAdvBack").attr("rel", "projectList");
            }
            else if (targetRel == "projectTrash") {
                //改变返回button的rel指向项目列表界面
                $(".proTraBack").attr("rel", "projectList");
            }
        }
        else {
            confirmShow(0, "", "请先在列表中选择一个项目。", "消息提示");
        }
    });

    $(".proOver").click(function () {
        var targetRel = $(this).attr("rel");
        $(".row").hide();
        $("#" + targetRel).show();
    });

    //课程表点击
    $(".courListTr td:not(.tdBefore)").unbind('click').click(function () {
        if ($(this).parent().parent().parent("table").hasClass("cour")) {
            $("#recordAdd").hide();
        }
        else {
            $("#recordAdd").show();
        }
        cursorShow(this, "", "");
    });

    $("#corType").change(function () {
        var valCorType = $("#corType").val();
        if (valCorType == 1) {
            $("#planStage").hide();
            $("#nameTxt").hide();
            $("#nameSel").show();
        }
        else if (valCorType == 2) {
            $("#planStage").show();
            $("#nameTxt").hide();
            $("#nameSel").show();
        }
        else {
            $("#planStage").hide();
            $("#nameTxt").show();
            $("#nameSel").hide();
        }
    });

    //课程表时间
    initDate(1);

    //课程表时间减少一周
    $(".glyphicon-chevron-left").click(function () {
        initDate(0);
    });

    //课程表时间增加一周
    $(".glyphicon-chevron-right").click(function () {
        initDate(2);
    });


    //任务-待办-项目超期页面三个按钮显示
    $("#extendedTarget").click(function () {
        $("#planBacklog .overTimePro").show();
    });
    //任务-待办-项目超期其他页面三个按钮显示
    $("#extendedTarget").siblings("li").click(function () {
        $("#planBacklog .overTimePro").hide();
    });


    /*$(".dashedImg").hover(function(){
    $(this).attr("src","images/solidStars.png");
    $(this).prevAll().attr("src","images/solidStars.png");
    $(this).nextAll().attr("src","images/dashStars.png");
    });*/

    //任务-请派-评价结果的img
    $(".dashedImg").dblclick(function () {
        $(this).attr("src", "images/solidStars.png");
        $(this).prevAll().attr("src", "images/solidStars.png");
        $(this).nextAll().attr("src", "images/dashStars.png");
    });

    //任务-请派-尚未请派点击时显示(新增。删除。编辑按钮)
    $("#notSendTarget").click(function () {
        $("#taskSend .overTimePro").show();
    });

    $("#notSendTarget").siblings("li").click(function () {
        $("#taskSend .overTimePro").hide();
    });

    // 任务-请派-尚未请派删除按钮
    $(".notSendDelete").click(function () {
        if (!$(".cusListTr").hasClass("cusSelect")) {
            confirmShow(0, "", "请先在列表中选择一个客户。", "消息提示");
            return;
        }
        confirmShow(0, "", "确定删除吗？删除请点击确定按钮。", "消息提示");
    });

    // 任务-请派-尚未请派编辑按钮
    $(".notSendEdit").click(function () {
        if (!$(".cusListTr").hasClass("cusSelect")) {
            confirmShow(0, "", "请先在列表中选择一个客户。", "消息提示");
            return;
        }
        //===========此处可以传一个方法名的参数
        notSendShow();
    });

    // 任务-请派-尚未请派编辑按钮
    $(".notSendAdd").click(function () {
        if (!$(".cusListTr").hasClass("cusSelect")) {
            confirmShow(0, "", "请先在列表中选择一个客户。", "消息提示");
            return;
        }
        notSendShow();
    });

    //任务-请派-已经请派-统计按钮压下
    $(".count").click(function () {
        //显示已经请派统计按钮的饼图
        $("#sendCount").show();
        //任务请派饼图
        sendPie();
        $("#sendCount").siblings().hide();
    });

    //任务-待办-委派事项
    $(".appointMat").click(function () {
        appointMatShow("销售会议", "回复内容");
    });

    //任务-待办-任务计划
    $(".taskShow").click(function () {
        appointMatShow("大数据分析平台", "计划内容");
    });

    //任务-待办-渠道拜访-不拜访
    $(".doNotVisit").click(function () {
        appointMatShow("不拜访", "理由");
    });

    //任务-待办-渠道拜访-马上拜访
    $(".visitAtOnce").click(function () {
        visitShow(2, "马上拜访");
    });

    //任务-待办-渠道拜访-已经拜访
    $(".haveVisited").click(function () {
        visitShow(1, "已经拜访");
    });


    //给每一个li添加parent_li样式，每个li下第一个span添加title
    $('.tree li:not(.firstChild)').addClass('parent_li').find(' > span').attr('title', '折叠');
    $('#panorama .treeA').find(' > span').attr('title', '双击编辑');

    $('.tree li.parent_li > span').click(function (e) {
        var children = $(this).parent('li.parent_li').find(' > ul > li');
        if (children.is(":visible")) {
            children.hide('fast');
            //切换图片js
            $(this).attr('title', '打开').find(' > i').addClass('glyphicon-plus-sign').removeClass('glyphicon-minus-sign');
        } else {
            children.show('fast');
            $(this).attr('title', '折叠').find(' > i').addClass('glyphicon-minus-sign').removeClass('glyphicon-plus-sign');
        }
        //阻止冒泡
        e.stopPropagation();
    });

    $(".tree").find("a.treeA  span").click(function () {
        $("span").removeClass("treeSpan");
        $(this).addClass("treeSpan");
    });

	$('#panorama .treeA').find(' > span').dblclick(function(){
		var txt = $(this).text();
		$("#panoramaEdit").val(txt);
		panoramaShow(this);
	});

    //管理里面的漏斗
    //funnelManageMap();

    $("#taskType").change(function () {
        //获取选中的文字
        var taskType = $(this).find("option:selected").text();
        if (taskType == "待办") {
            $("#toDoShow").show();
            $("#toDoContent").show();
            $("#planContent").hide();
            $("#recordContent").hide();
        }
        else if (taskType == "计划") {
            $("#toDoShow").hide();
            $("#toDoContent").hide();
            $("#planContent").show();
            $("#recordContent").hide();

        }
        else if (taskType == "记录") {
            $("#toDoShow").hide();
            $("#toDoContent").hide();
            $("#planContent").hide();
            $("#recordContent").show();

        }
    });

    $("#toDoTypeS").change(function () {
        var toDoType = $(this).find("option:selected").text();
        if (toDoType == "渠道拜访") {
            $("#mChannelVisit").show();
            $("#mChannelVisit").siblings().hide();
        }
        else if (toDoType == "项目超期") {
            $("#mExtendedProject").show();
            $("#mExtendedProject").siblings().hide();
        }
        else if (toDoType == "委派事项") {
            $("#mAppointedMatters").show();
            $("#mAppointedMatters").siblings().hide();
        }
        else if (toDoType == "任务计划") {
            $("#mMissionPlan").show();
            $("#mMissionPlan").siblings().hide();
        }
    });

    $(".appOpinion").hide();

    //审批过程下拉箭头点击
    $(".spanClick").click(function () {
        var appOpinion = $(this).parent().parent().parent().next();
        if (appOpinion.is(":hidden")) {
            appOpinion.show("100");
            $(this).children("i").addClass("glyphicon-chevron-right").removeClass("glyphicon-chevron-down");
        }
        else {
            appOpinion.hide("100");
            $(this).children("i").addClass("glyphicon-chevron-down").removeClass("glyphicon-chevron-right");
        }
    });

    //管理-审批历史点击
    $("#appHistory").click(function () {
        $("#ManAppHistory").show();
        $("#ManagementApproval").hide();
    });

    //管理-审批过程点击
    $(".appBtn").click(function () {
        $("#ManAppProcess").show();
        $("#ManagementApproval").hide();
    });

    //管理统计里面的top Menu点击

    /*$("#ManagementCount li a").click(function(){
    var manageRel = $(this).attr("href");
    //业务结构分析
    if (manageRel == "#businessCon")
    {
    //行业类型饼图
    industryDonePie();
    //项目类型饼图
    projectDonePie();
    //规模类型饼图
    scaleDonePie();
    }
    else if (manageRel == "#taskStructureCon")
    {
    //分类耗费占比饼图
    classifyCostPie()
    }
    });*/

    // 管理-统计-绩效统计分析-趋势绩效预测 点击，要显示折线图
    $("#trendTarget").click(function () {
        $("#perforTrend").addClass("active");
        $("#perforTrend").siblings().removeClass("active");
        lineChart();
    });

    $("#busDoneTarget").click(function () {
        $("#busDoneCon").addClass("active");
        $("#busDoneCon").siblings().removeClass("active");
        //行业类型饼图
        industryDonePie();
        //项目类型饼图
        projectDonePie();
        //规模类型饼图
        scaleDonePie();
    });

    $("#busTrendTarget").click(function () {
        $("#busTrendCon").addClass("active");
        $("#busTrendCon").siblings().removeClass("active");
        //行业类型饼图
        industryTrendPie();
        //项目类型饼图
        projectTrendPie();
        //规模类型饼图
        scaleTrendPie();

    });

    $("#classifyTarget").click(function () {
        $("#classifyCost").addClass("active");
        $("#classifyCost").siblings().removeClass("active");
        //分类耗费占比饼图
        classifyCostPie();
    });

    $("#proCostTarget").click(function () {
        $("#projectCost").addClass("active");
        $("#projectCost").siblings().removeClass("active");
        //项目耗费占比柱状图
        projectCostBar();
    });

    $("#stageCostTarget").click(function () {
        $("#stageCost").addClass("active");
        $("#stageCost").siblings().removeClass("active");
        //阶段耗费占比饼图
        stageCostPie();
    });

    $("#attendTarget").click(function () {
        $("#attendanceMonthly").addClass("active");
        $("#attendanceMonthly").siblings().removeClass("active");
        //考勤月报
        attendancePie();
    });


    //表格背景色
    saleRateFilter();

    saleCycleFilter();


//点击设置-进阶表格行选中
    $(".panoramaNo").click(function () {
        if ($(this).hasClass("cusSelect")) {
            $(this).css("background-color", "");
            $(this).css("color", "#000000");
            $(this).removeClass("panoramaSelect");
        }
        else {
			$(".panoramaNo").css("background-color", "");
			$(".panoramaNo").css("color", "#000000");
			$(".panoramaNo").removeClass("cusSelect");
            $(this).css("background-color", "#2dc3e8");
            $(this).css("panoramaSelect", "#ffffff");
			$(this).addClass("panoramaSelect");
        }
    });

	//设置-进阶-新增
	$(".setAdvAdd").click(function(){
		if ($(".panoramaNo").hasClass("panoramaSelect"))
		{
			setAdvaShow();
			var txt = $("#setUpTemplate .panoramaSelect").text();
			// wait to update...
			// $("#advStageName").val("1");
		}
		else
		{
			confirmShow(0, "", "请先在列表中选择一个客户。", "消息提示");
		}
	});

	// 设置-进阶-编辑
	$(".setAdvEdit").click(function(){
		if ($(".cusListTr").hasClass("cusSelect"))
		{
			setAdvaShow();
			//var txt = $("#setUpTemplate .panoramaSelect").text();
			// wait to update...
			// $("#advStageName").val("1");
		}
		else
		{
			confirmShow(0, "", "请先在列表中选择一个客户。", "消息提示");
		}
	});

	// 设置-进阶-删除
	$(".setAdvDelete").click(function(){
		if ($(".cusListTr").hasClass("cusSelect"))
		{
			// wait to delete function
		}
		else
		{
			confirmShow(0, "", "请先在列表中选择一个客户。", "消息提示");
		}
	});

	//设置-部门-新增部门
	$("#addDepart").click(function(){
		$("#addDepartment").show();
	});

	//设置-部门-新增部门-保存按钮
	$("#saveDepart").click(function(){
		var departName = $("#departName").val();
		var preName = $("#preName").find("option:selected").text();
		$("#departTree").find("span").each(function(){
			if ($(this).text() == preName)
			{
				var str = "<ul><li><a class='treeA' onclick='treeSpan(this)'><span>"+departName+"</span></a></li></ul>";
				$(this).parent("a").parent("li").append(str);
			}
		});
	});

	//设置-岗位-新增岗位add edit
	$("#postAdd").click(function(){
		postShow();
	});

	//设置-岗位-新增岗位edit
	$("#postEdit").click(function(){
        if (!$(".cusListTr").hasClass("cusSelect")) {
            confirmShow(0, "", "请先在列表中选择一个岗位。", "消息提示");
            return;
        }
		postShow();
	});
	
	//设置-岗位-新增岗位edit
	$("#postDele").click(function(){
        if (!$(".cusListTr").hasClass("cusSelect")) {
            confirmShow(0, "", "请先在列表中选择一个岗位。", "消息提示");
            return;
        }
		// wait for real data
		//// function.........
	});

	//设置-组织-人员-新增
	$("#personAdd").click(function(){
		$("#personCon").hide();
		$("#personAddCon").show();
	});

	//设置-组织-人员-编辑
	$("#personEdit").click(function(){
		if (!$(".cusListTr").hasClass("cusSelect")) {
            confirmShow(0, "", "请先在列表中选择一个岗位。", "消息提示");
            return;
        }
		$("#personCon").hide();
		$("#personAddCon").show();
	});

	//设置-组织-人员-删除
	$("#personDele").click(function(){
		if (!$(".cusListTr").hasClass("cusSelect")) {
            confirmShow(0, "", "请先在列表中选择一个岗位。", "消息提示");
            return;
        }
		//wait to dele.............

	});

	//设置-组织-角色-新增
	$("#roleAdd").click(function(){
		$("#roleCon").hide();
		$("#roleAddCon").show();
	});

	//设置-组织-角色-新增
	$("#roleEdit").click(function(){
		if (!$(".cusListTr").hasClass("cusSelect")) {
            confirmShow(0, "", "请先在列表中选择一个岗位。", "消息提示");
            return;
        }
		$("#roleCon").hide();
		$("#roleAddCon").show();
	});

	//设置-组织-角色-删除
	$("#roleDele").click(function(){
		if (!$(".cusListTr").hasClass("cusSelect")) {
            confirmShow(0, "", "请先在列表中选择一个岗位。", "消息提示");
            return;
        }
		//wait to dele.............

	});

	//授权界面全选。全不选。
	$(".ckAll").click(function() {
		var attrName = $(this).attr("rel");
		$("input[name="+attrName+"]").prop("checked", this.checked);
	});

	$(".ckChild").click(function(){
		var childName = $(this).attr("name");
		var $subs = $("input[name="+childName+"]");
		var ckParent = jQuery('[rel|='+childName+']');
		$(ckParent).prop("checked" , $subs.length == $subs.filter(":checked").length ? true :false);
	});


	//设置-进阶页面三个按钮显示
    $("#setAdvTarget").click(function () {
        $("#setUpTemplate .overTimePro").show();
    });
    //任务-待办-项目超期其他页面三个按钮显示
    $("#setAdvTarget").siblings("li").click(function () {
        $("#setUpTemplate .overTimePro").hide();
    });
  

});


// 组织树新增span添加
function treeSpan(obj) {
	$("#departTree span").removeClass("treeSpan");
	$(obj).addClass("treeSpan");
	
}


// 显示遮罩层
function confirmShow(id, callback, text, title) {
    $(".cancelHide").hide();
    $("#bg").css("display", "block");
    $("#modalShow").css("display", "block");
    if (text != null) {
        $("#modalShow .modal-body").text("");
        $("#modalShow .modal-body").append(text);
    }
    if (title != null) {
        $("#modalShow .modal-title").text("");
        $("#modalShow .modal-title").append(title);
    }
    //确定按钮事件
    $(".btnCloseSure").click(function () {
        $("#bg").css("display", "none");
        $("#modalShow").css("display", "none");
        if (typeof (callback) == 'function') {
            if (id == null) {
                callback();
            } else {
                callback(id);
            }
        }
    });
    //取消按钮事件
    $(".btnCloseCancel").click(function () {
        $("#bg").css("display", "none");
        $("#modalShow").css("display", "none");
    });

}

// 显示新增岗位遮罩层
function postShow(id, callback) {
    $("#bg").css("display", "block");
    $("#addPost").css("display", "block");
    //确定按钮事件
    $(".btnCloseSure").click(function () {
        $("#bg").css("display", "none");
        $("#addPost").css("display", "none");
        if (typeof (callback) == 'function') {
            if (id == null) {
                callback();
            } else {
                callback(id);
            }
        }
    });
    //取消按钮事件
    $(".btnCloseCancel").click(function () {
        $("#bg").css("display", "none");
        $("#addPost").css("display", "none");
    });

}

//显示操作成功失败提示框
function actionShow(txt){
    $("#bg").css("display", "block");
    $("#actionShow").css("display", "block");
	if (txt != null && typeof (txt) != "undefined")
	{
		$(".actionSpan").text("");
		$(".actionSpan").text(txt);
	}
	//取消按钮事件
    $(".btnCloseCancel").click(function () {
        $("#bg").css("display", "none");
        $("#actionShow").css("display", "none");
    });
}

// 显示修改密码遮罩层
function passwordShow(callback) {
    $("#bg").css("display", "block");
    $("#updatePassword").css("display", "block");
    //确定按钮事件
    $(".btnCloseSure").click(function () {
        $("#bg").css("display", "none");
        $("#updatePassword").css("display", "none");
        if (typeof (callback) == 'function') {
            if (id == null) {
                callback();
            } else {
                callback(id);
            }
        }
    });
    //取消按钮事件
    $(".btnCloseCancel").click(function () {
        $("#bg").css("display", "none");
        $("#updatePassword").css("display", "none");
    });

}

//显示遮罩层和委派事项弹窗
function appointMatShow(txt, string) {
    $("#bg").css("display", "block");
    $("#appointMatters").css("display", "block");
    if (txt != null) {
        $("#appointMatters .modal-title").text("");
        $("#appointMatters .modal-title").append(txt);
    }
    if (string != null) {
        $("#appointMatters .cursorLabel").text("");
        $("#appointMatters .cursorLabel").append(string);
    }
    $(".btnCloseSure").click(function () {
        $("#bg").css("display", "none");
        $("#appointMatters").css("display", "none");
        if (typeof (callback) == 'function') {
            if (id == null) {
                callback();
            } else {
                callback(id);
            }
        }
    });
    //取消按钮事件
    $(".btnCloseCancel").click(function () {
        $("#bg").css("display", "none");
        $("#appointMatters").css("display", "none");
    });
}

// 显示进阶提示框
function setAdvaShow(callback) {
    $("#bg").css("display", "block");
    $("#setAdva").css("display", "block");
    $(".btnCloseSure").click(function () {
        $("#bg").css("display", "none");
        $("#setAdva").css("display", "none");
        if (typeof (callback) == 'function') {
            if (id == null) {
                callback();
            } else {
                callback(id);
            }
        }
    });
    //取消按钮事件
    $(".btnCloseCancel").click(function () {
        $("#bg").css("display", "none");
        $("#setAdva").css("display", "none");
    });
}

// 显示导出界面提示框
function exportShow(name, callback) {
    $("#bg").css("display", "block");
    $("#" + name).css("display", "block");
    $(".btnCloseSure").click(function () {
        $("#bg").css("display", "none");
        $("#" + name).css("display", "none");
        if (typeof (callback) == 'function') {
            if (id == null) {
                callback();
            } else {
                callback(id);
            }
        }
    });
    //取消按钮事件
    $(".btnCloseCancel").click(function () {
        $("#bg").css("display", "none");
        $("#" + name).css("display", "none");
    });
}

//显示编辑计划课程表的提示框
function cursorShow(obj, spanTxt, spanClass) {
    $("#bg").css("display", "block");
    $("#cursorShow").css("display", "block");
    if (spanTxt != "") {
        //不向父节点传递事件
        event.cancelBubble = true;
        //取出span元素的内容是 类型：名称
        var arr = spanTxt.split("：");
        // arr[0]就是项目类型curName
        $("#corType").find("option[text='" + arr[0] + "']").attr("selected", true);
        //若是项目类型为渠道或者项目，项目名称显示的是下拉框
        if (arr[0] == "渠道" || arr[0] == "项目") {
            $("#curName").find("option[text='" + arr[1] + "']").attr("selected", true);
        }
        else {
            //否则显示的是txt
            $("#txtName").val(arr[1]);
        }

        //wait......=======================此时等待后台数据填充================================
        //类容和提醒需要后台填充

        // 删除按钮显示
        $(".btnDele").show();
        // 取消按钮隐藏
        $(".btnCancel").hide();
        if (spanClass == "spanPlan redPlan") {
            $("#eventType").find("option[value='1']").attr("selected", true);
        }
        else if (spanClass == "spanPlan greenPlan") {
            $("#eventType").find("option[value='2']").attr("selected", true);
        }
        //确定按钮
        $(".btnCloseSure").unbind('click').click(function () {
            var strName;
            if ($("#nameSel").show()) {
                strName = $("#curName").find("option:selected").text();
            }
            else {
                strName = $("#txtName").val();
            }
            var strType = $("#corType").find("option:selected").text();
            var val = $("input[name='eventType']:checked").val();
            //事件类型 名称 类型都为必填
            if (val == 0 || strName == "请选择" || strName == "" || strType == "请选择") {
                $("#bg").css("display", "none");
                $("#cursorShow").css("display", "none");
                obj = null;

            }
            else {
                var cursorStr = appendCursor(strName, val, strType);
                var td = $(obj).parent();
                //主要事件只有一个
                if (val == 1) {
                    if ($(obj).parent().children("span").hasClass("redPlan")) {
                        $(obj).parent().children("span.redPlan").remove();
                    }
                }
                td.append(cursorStr);
                obj = null;
                $("#bg").css("display", "none");
                $("#cursorShow").css("display", "none");
            }
        });

        //删除按钮
        $(".btnDele").unbind('click').click(function () {
            $(obj).remove();
            $("#bg").css("display", "none");
            $("#cursorShow").css("display", "none");
        });

        //取消按钮事件
        $(".btnCloseCancel").click(function () {
            $("#bg").css("display", "none");
            $("#cursorShow").css("display", "none");
            obj = null;
        });
    }
    else {
        $(".btnDele").hide();
        $(".btnCancel").show();
        $("#event").val("");
        $("#eventType").find("option[value='0']").attr("selected", true);
        //确定按钮点击
        $(".btnCloseSure").unbind('click').click(function () {
            var strName;
            if ($("#nameSel").show()) {
                strName = $("#curName").find("option:selected").text();
            }
            else {
                strName = $("#txtName").val();
            }
            var strType = $("#corType").find("option:selected").text();
            var val = $("input[name='eventType']:checked").val();
            //事件类型 名称 类型都为必填
            if (val == 0 || strName == "请选择" || strName == "" || strType == "请选择") {
                $("#bg").css("display", "none");
                $("#cursorShow").css("display", "none");
                obj = null;
            }
            else {
                var cursorStr = appendCursor(strName, val, strType);
                //主要事件只有一个
                if (val == 1) {
                    if ($(obj).children("span").hasClass("redPlan")) {
                        $(obj).children("span.redPlan").remove();
                    }
                }
                $(obj).append(cursorStr);
                obj = null;
                $("#bg").css("display", "none");
                $("#cursorShow").css("display", "none");
            }
        });
        //取消按钮事件
        $(".btnCloseCancel").click(function () {
            $("#bg").css("display", "none");
            $("#cursorShow").css("display", "none");
            obj = null;
        });
    }
}

//显示马上拜访和已经拜访的提示框
function visitShow(n, str) {
    $("#bg").css("display", "block");
    $("#cursorShow").css("display", "block");
    $("#timeVisit").css("display", "block");
    $(".btnDele").css("display", "none");
    if (n == 1) {
        $("#recordAdd").css("display", "block");
    }
    else {
        $("#recordAdd").css("display", "none");
    }
    if (str != null) {
        $(".modal-title").text("");
        $(".modal-title").append(str);
    }
    $(".btnCloseSure").click(function () {
        $("#bg").css("display", "none");
        $("#cursorShow").css("display", "none");
        if (typeof (callback) == 'function') {
            if (id == null) {
                //callback();
            } else {
                //callback(id);
            }
        }

        $("#timeVisit").css("display", "none");
        $(".modal-title").text("");
    });
    //取消按钮事件
    $(".btnCloseCancel").click(function () {
        $("#bg").css("display", "none");
        $("#cursorShow").css("display", "none");
        $("#timeVisit").css("display", "none");
        $(".modal-title").text("");
    });
}

//任务-请派-尚未编辑-编辑和新增提示框
function notSendShow(callback) {
    $("#bg").css("display", "block");
    $("#notSendEdite").css("display", "block");
    $(".btnCloseSure").click(function () {
        $("#bg").css("display", "none");
        $("#notSendEdite").css("display", "none");
        if (typeof (callback) == 'function') {
            if (id == null) {
                //callback();
            } else {
                //callback(id);
            }
        }
    });
    //取消按钮事件
    $(".btnCloseCancel").click(function () {
        $("#bg").css("display", "none");
        $("#notSendEdite").css("display", "none");
    });
}

//设置-模板-全景图-编辑提示框
function panoramaShow(obj,callback) {
    $("#bg").css("display", "block");
    $("#panoramaShow").css("display", "block");
    $(".btnCloseSure").click(function () {
		var editTxt = $("#panoramaEdit").val();
        $("#bg").css("display", "none");
        $("#panoramaShow").css("display", "none");
		$(obj).text(editTxt);
		obj = null;
        if (typeof (callback) == 'function') {
            if (id == null) {
                //callback();
            } else {
                //callback(id);
            }
        }
    });
    //取消按钮事件
    $(".btnCloseCancel").click(function () {
        $("#bg").css("display", "none");
        $("#panoramaShow").css("display", "none");
    });
}

//显示课程表具体任务，编辑span元素
function curSpanEidt(obj) {
    var spanTxt = $(obj).text();
    var spanClass = $(obj).attr("class");
    cursorShow(obj, spanTxt, spanClass);
}

//获取显示的字符串以及计划类型
function appendCursor(str, val, strType) {
    if (val == 1) {
        classNm = "spanPlan redPlan";
    }
    else if (val == 2) {
        classNm = "spanPlan greenPlan";
    }
    var htmlStr = "<span class='" + classNm + "' onclick='curSpanEidt(this)'>" + strType + "：" + str + "</span>";
    return htmlStr;
}

//得到文件上传时的文件名
function getFileName(obj) {
    var name = getNamebyPath(obj.value);
    $(obj).parent().siblings(".fileDisplay").html(name);
}
// IE等浏览器得到的是路径，取名字
function getNamebyPath(path) {
    var pos1 = path.lastIndexOf('/');
    var pos2 = path.lastIndexOf('\\');
    var pos = Math.max(pos1, pos2)
    if (pos < 0)
        return path;
    else
        return path.substring(pos + 1);
}

//改变textarea的大小
function changeRange(obj) {
    if ($(obj).height() < 50) {
        $(obj).css("height", "120px");
    }
}

//设置面包屑导航
function setMenuTxt(childFirTxt, childSecTxt) {
    $(".breadcrumb li").remove();
    var topTxt = $(".top-menu li.active").children("a").text();
    var rel = $(".top-menu li.active").children("a").attr("rel");
    var leftRel = $("#" + rel + " ul:first>li.active").attr("rel");
    var leftTxt = $("#" + rel + " ul:first>li.active").children("a").children("span").text();
    var str = "<li><a href='javascript:void(0);' onclick='pageJump(" + rel + ")'>" + topTxt + "</a></li>";
    if (leftTxt != "" && typeof (leftTxt) != "undefined") {
        str += "<li><a href='javascript:void(0);' onclick='pageJump(" + leftRel + ")'>" + leftTxt + "</a></li>";
    }
    if (childFirTxt != "" && typeof (childFirTxt) != "undefined") {
        str += "<li><a href='javascript:void(0);'>" + childFirTxt + "</a></li>";
    }
    if (childSecTxt != "" && typeof (childSecTxt) != "undefined") {
        str += "<li><a href='javascript:void(0);'>" + childSecTxt + "</a></li>";
    }
    $(".breadcrumb").append(str);
}

//设置面包屑导航点击跳转
function pageJump(rel) {
    var id = $(rel).attr("id");
    //若点击的是漏斗
    if (id == "funnel") {
        $("#funnelCon").show();
        $("#funnelCon").siblings().hide();
    }

    $("#" + id).show();
    $("#" + id).siblings().hide();
}

//得到当前年月日以及周数
var currentDate = new Date();
function initDate(id) {

    if (id == 1) {
        var date = new Date();
    }
    else if (id == 0) {
        var date = new Date(currentDate.getTime() - 86400000 * 7);
        currentDate = date;

    }
    else if (id == 2) {
        var date = new Date(currentDate.getTime() + 86400000 * 7);
        currentDate = date;
    }
    var year = date.getFullYear();
    var day = date.getDate();
    var weekList = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六");
    var mon = new Array("1", "2", "3", "4", "5", "6", "7", "8",
                "9", "10", "11", "12");
    var week = weekList[date.getDay()];
    var month = mon[date.getMonth()];
    dateStr = year + "年" + month + "月" + day + "日&nbsp;&nbsp;&nbsp;" + week;
    $(".courListTitle").text("");
    $(".courListTitle").append(dateStr);

}


//设定销售效率统计低于删选时背景色
function saleRateFilter() {
    //设置切入成功率
    $(".cutRate").each(function () {
        var cutRateStr = $(this).text();
        var cutRate = parseFloat(cutRateStr);
        if (cutRate < 50) {
            $(this).css("background-color", "red");
            $(this).css("color", "#fff");
        }
    });

    //培育成功率
    $(".breedRate").each(function () {
        var breedRateStr = $(this).text();
        var breedRate = parseFloat(breedRateStr);
        if (breedRate < 60) {
            $(this).css("background-color", "red");
            $(this).css("color", "#fff");
        }
    });


    //策划成功率
    $(".planRate").each(function () {
        var planRateStr = $(this).text();
        var planRate = parseFloat(planRateStr);
        if (planRate < 80) {
            $(this).css("background-color", "red");
            $(this).css("color", "#fff");
        }
    });


    //投标成功率
    $(".bidRate").each(function () {
        var bidRateStr = $(this).text();
        var bidRate = parseFloat(bidRateStr);
        if (bidRate < 60) {
            $(this).css("background-color", "red");
            $(this).css("color", "#fff");
        }
    });

    //综合成功率
    $(".multipleRate").each(function () {
        var multipleRateStr = $(this).text();
        var multipleRate = parseFloat(multipleRateStr);
        if (multipleRate < 14.4) {
            $(this).css("background-color", "red");
            $(this).css("color", "#fff");
        }
    });
}

//设定销售周期统计低于筛选时背景色
function saleCycleFilter() {
    //设置切入周期
    $(".cutCycle").each(function () {
        var cutCycleStr = $(this).text();
        var cutCycle = parseFloat(cutCycleStr);
        if (cutCycle > 2) {
            $(this).css("background-color", "red");
            $(this).css("color", "#fff");
        }
    });

    //设置培育周期
    $(".breedCycle").each(function () {
        var breedCycleStr = $(this).text();
        var breedCycle = parseFloat(breedCycleStr);
        if (breedCycle > 6) {
            $(this).css("background-color", "red");
            $(this).css("color", "#fff");
        }
    });

    //设置策划周期
    $(".planCycle").each(function () {
        var planCycleStr = $(this).text();
        var planCycle = parseFloat(planCycleStr);
        if (planCycle > 1) {
            $(this).css("background-color", "red");
            $(this).css("color", "#fff");
        }
    });

    //设置投标周期
    $(".bidCycle").each(function () {
        var bidCycleStr = $(this).text();
        var bidCycle = parseFloat(bidCycleStr);
        if (bidCycle > 2) {
            $(this).css("background-color", "red");
            $(this).css("color", "#fff");
        }
    });

    //设置综合周期
    $(".multipleCycle").each(function () {
        var multipleCycleStr = $(this).text();
        var multipleCycle = parseFloat(multipleCycleStr);
        if (multipleCycle > 1) {
            $(this).css("background-color", "red");
            $(this).css("color", "#fff");
        }
    });

}


// 显示漏斗图
function funnelMap() {
    require(
    [
    'echarts', // 使用柱状图就加载bar模块，按需加载 funnel
	'echarts/chart/funnel'
    ],
	function (ec) {
	    var myChart = ec.init(document.getElementById('funnelMap'));
	    // 自定义扩展图表类型：mapType = USA
	    var option = {
	        color: [
        'rgba(255, 69, 0, 0.5)',
        'rgba(255, 150, 0, 0.5)',
        'rgba(255, 200, 0, 0.5)',
        'rgba(155, 200, 50, 0.5)'
    ],
	        tooltip: {
	            trigger: 'item',
	            formatter: "{a} <br/>{b} : {c}%"
	        },
	        toolbox: {
	            show: true
	        },
	        legend: {
	            orient: 'vertical',
	            x: 'left',
				y:'bottom',
	            // data : ['展现','点击','访问','咨询','订单']
	            data: ['获取信息', '培育公关', '策划运作', '投标竞标']
	        },
			//不允许拖拽
	        calculable: false,
	        series: [
        /*{
            name: '预期',
            type: 'funnel',
			x:0,
			y:55,
			y2:0,
            minSize: '25%',
            width: '80%',
            itemStyle: {
                normal: {
                    label: {
                        formatter: '{b}',
                        textStyle: {
                            color: '#008',
                            fontSize: 14
                        }
                    },
                    labelLine: {
                        show: false
                    }
                },
                emphasis: {
                    label: {
                        position: 'inside',
                        formatter: '{b}预期 : {c}%'
                    }
                }
            },
            data: [
                { value: 40, name: '投标竞标' },
                { value: 50, name: '策划运作' },
                { value: 90, name: '培育公关' },
                { value: 100, name: '获取信息' }
            ]
        },*/
        {
            name: '实际',
            type: 'funnel',
			x:0,
			y:0,
			y2:0,
            width: '80%',
            maxSize: '80%',
            minSize: '10%',
            itemStyle: {
                normal: {
                    borderColor: '#fff',
                    borderWidth: 2,
                    label: {
                        position: 'inside',
                        formatter: '{b}:{c}%',
                        textStyle: {
                            color: '#000',
                            fontSize: 14
                        }
                    }
                },
                emphasis: {
                    label: {
                        position: 'inside',
                        formatter: '{b}实际 : {c}%'
                    }
                }
            },
            data: [
                { value: 30, name: '投标竞标' },
                { value: 40, name: '策划运作' },
                { value: 60, name: '培育公关' },
                { value: 80, name: '获取信息' }
            ]
        }
    ]
	    };
	    myChart.setOption(option);
	});
}


// 显示管理漏斗图
function funnelManageMap() {
    require(
    [
    'echarts', // 使用柱状图就加载bar模块，按需加载 funnel
	'echarts/chart/funnel'
    ],
	function (ec) {
	    var myChart = ec.init(document.getElementById('funnelManageMap'));
	    // 自定义扩展图表类型：mapType = USA
	    var option = {
	        color: [
        'rgba(255, 69, 0, 0.5)',
        'rgba(255, 150, 0, 0.5)',
        'rgba(255, 200, 0, 0.5)',
        'rgba(155, 200, 50, 0.5)'
    ],
	        tooltip: {
	            trigger: 'item',
	            formatter: "{a} <br/>{b} : {c}%"
	        },
	        toolbox: {
	            show: true
	        },
	        legend: {
	            // data : ['展现','点击','访问','咨询','订单']
	            data: ['获取信息', '培育公关', '策划运作', '投标竞标', '签约移交']
	        },
	        calculable: true,
	        series: [
        {
            name: '预期',
            type: 'funnel',
            x: '10%',
            width: '80%',
            minSize: '10%',
            itemStyle: {
                normal: {
                    label: {
                        formatter: '{b}',
                        textStyle: {
                            color: '#000',
                            fontSize: 14
                        }
                    },
                    labelLine: {
                        show: false
                    }
                },
                emphasis: {
                    label: {
                        position: 'inside',
                        formatter: '{b}预期 : {c}%'
                    }
                }
            },
            data: [
                { value: 50, name: '投标竞标' },
                { value: 80, name: '策划运作' },
                { value: 90, name: '培育公关' },
                { value: 100, name: '获取信息' }
            ]
        },
        {
            name: '实际',
            type: 'funnel',
            x: '10%',
            width: '80%',
            maxSize: '80%',
            minSize: '5%',
            itemStyle: {
                normal: {
                    borderColor: '#fff',
                    borderWidth: 2,
                    label: {
                        position: 'inside',
                        formatter: '{c}',
                        textStyle: {
                            color: '#000',
                            fontSize: 14
                        }
                    }
                },
                emphasis: {
                    label: {
                        position: 'inside',
                        formatter: '{b}实际 : {c}%'
                    }
                }
            },
            data: [
                { value: 30, name: '签约移交' },
                { value: 20, name: '投标竞标' },
                { value: 50, name: '培育公关' },
                { value: 80, name: '获取信息' }
            ]
        }
    ]
	    };
	    myChart.setOption(option);
	});
}

function sendPie() {
    require(
    [
    'echarts',
    'echarts/chart/pie'
    ],
	function (ec) {
	    var myChart = ec.init(document.getElementById('sendPie'));
	    // 自定义扩展图表类型：mapType = USA
	    var option = {
	        color: [
				'#5cb85c',
				'#5bc0de',
				'#f0ad4e',
				'#e75b8d',
				'#d9534f'
			],
	        tooltip: {
	            show: true,
	            formatter: "{a} <br/>{b} : {c} ({d}%)"
	        },
	        legend: {
	            orient: 'vertical',
	            x: '180',
	            y: 'center',
	            data: ['一星好评', '二星好评', '三星好评', '四星好评', '五星好评']
	        },
	        //是否拖拽
	        //calculable : true,
	        series: [
				{
				    name: '请派好评率',
				    type: 'pie',
				    selectedMode: 'single',
				    //设置饼图的位置
				    center: ['45%', 180],
				    //设置饼图大小
				    radius: 150,
				    itemStyle: {
				        normal: {
				            label: {
				                //数据百分比显示在饼图里面
				                position: 'inner',
				                formatter: function (params) {
				                    return (params.percent - 0).toFixed(0) + '%'
				                }
				            },
				            labelLine: {
				                //饼图指线
				                show: false
				            }
				        },
				        emphasis: {
				            //鼠标悬浮时饼图上数据显示
				            label: {
				                show: true,
				                formatter: "{b}\n{d}%"
				            }
				        }

				    },
				    data: [
						{ value: 15, name: '一星好评' },
						{ value: 29, name: '二星好评' },
						{ value: 8, name: '三星好评' },
						{ value: 19, name: '四星好评' },
						{ value: 10, name: '五星好评' }
					]
				}
			]
	    };


	    // 为echarts对象加载数据 
	    myChart.setOption(option);

	    //饼图点击
	    var ecConfig = require('echarts/config');
	    myChart.on(ecConfig.EVENT.PIE_SELECTED, function (param) {
	        var selected = param.selected;
	        var str = '';
	        var serie;
	        for (var idx in selected) {
	            serie = option.series[idx];
	            for (var i = 0, l = serie.data.length; i < l; i++) {
	                //循环得到option第一个series中的name
	                name = option.series[0].data[i].name;
	                if (selected[idx][i]) {
	                    str += serie.data[i].name;
	                }
	            }
	        }
	        if (str == "五星好评") {
	            $(".5").siblings().hide();
	            $(".5").show();
	        }
	        else if (str == "四星好评") {
	            $(".4").siblings().hide();
	            $(".4").show();
	        }
	        else if (str == "三星好评") {
	            $(".3").siblings().hide();
	            $(".3").show();
	        }
	        else if (str == "二星好评") {
	            $(".2").siblings().hide();
	            $(".2").show();
	        }
	        else if (str == "一星好评") {
	            $(".1").siblings().hide();
	            $(".1").show();
	        }
	        else {
	            //alert("错误");
	        }


	        document.getElementById('message').innerHTML = str;
	    });
	});
}

//趋势绩效预测折线图
function lineChart() {
    require(
    [
    'echarts',
    'echarts/chart/line'
    ],
	function (ec) {
	    var myChart = ec.init(document.getElementById('perforTrend'));
	    var option = {
	        tooltip: {
	            trigger: "item",
	            formatter: "{a} <br/>{b} : {c}"
	        },
	        legend: {
	            x: 'left',
	            data: ["累计增长", "月度增长"]
	        },
	        xAxis: [
			   {
			       type: "category",
			       name: "月份",
			       splitLine: { show: false },
			       data: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"]
			   }
		   ],
	        yAxis: [
			   {
			       type: "value",
			       name: "金额（百万）"
			       //  data: ["0", "150", "300", "400", "600", "800", "1000"]
			   }
		   ],
	        series: [
			   {
			       name: "累计增长",
			       type: "line",
			       data: [1, 3, 669, 90, 270, 81, 247, 741, 223, 500, 800, 200]

			   },
			   {
			       name: "月度增长",
			       type: "line",
			       data: [1, 2, 4, 8, 16, 32, 64, 128, 256, 81, 247, 741, ]

			   }
		   ]
	    };
	    myChart.setOption(option);
	});
}


//行业类型饼图
function industryDonePie() {
    require(
    [
    'echarts',
    'echarts/chart/pie'
    ],
	function (ec) {
	    var myChart = ec.init(document.getElementById('busIndustry'));
	    // 自定义扩展图表类型：mapType = USA
	    var option = {
	        color: [
				'#5cb85c',
				'#5bc0de',
				'#f0ad4e',
				'#e75b8d',
				'#d9534f'
			],
	        title: {
	            text: '行业类型',
	            x: 'center'
	        },
	        tooltip: {
	            show: true,
	            formatter: "{a} <br/>{b} : {c} ({d}%)"
	        },
	        legend: {
	            orient: 'vertical',
	            x: 'left',
	            data: ['政府', '金融', '交通', '教育', '其他']
	        },
	        //是否拖拽
	        //calculable : true,
	        series: [
				{
				    name: '行业类型占比',
				    type: 'pie',
				    selectedMode: 'single',
				    //设置饼图的位置
				    center: ['55%', 170],
				    //设置饼图大小
				    radius: 130,
				    itemStyle: {
				        normal: {
				            label: {
				                //数据百分比显示在饼图里面
				                position: 'inner',
				                formatter: function (params) {
				                    return (params.percent - 0).toFixed(0) + '%'
				                }
				            },
				            labelLine: {
				                //饼图指线
				                show: false
				            }
				        },
				        emphasis: {
				            //鼠标悬浮时饼图上数据显示
				            label: {
				                show: true,
				                formatter: "{b}\n{d}%"
				            }
				        }

				    },
				    data: [
						{ value: 15, name: '政府' },
						{ value: 29, name: '金融' },
						{ value: 8, name: '交通' },
						{ value: 19, name: '教育' },
						{ value: 10, name: '其他' }
					]
				}
			]
	    };

	    // 为echarts对象加载数据 
	    myChart.setOption(option);
	});

}

//项目类型饼图
function projectDonePie() {
    require(
    [
    'echarts',
    'echarts/chart/pie'
    ],
	function (ec) {
	    var myChart = ec.init(document.getElementById('busProject'));
	    // 自定义扩展图表类型：mapType = USA
	    var option = {
	        color: [
				'#5cb85c',
				'#5bc0de',
				'#f0ad4e',
				'#e75b8d'
			],
	        title: {
	            text: '项目类型',
	            x: 'center'
	        },
	        tooltip: {
	            show: true,
	            formatter: "{a} <br/>{b} : {c} ({d}%)"
	        },
	        legend: {
	            orient: 'vertical',
	            x: 'left',
	            data: ['IT', 'IB', 'DC', 'SS']
	        },
	        //是否拖拽
	        //calculable : true,
	        series: [
				{
				    name: '项目类型占比',
				    type: 'pie',
				    selectedMode: 'single',
				    //设置饼图的位置
				    center: ['55%', 170],
				    //设置饼图大小
				    radius: 130,
				    itemStyle: {
				        normal: {
				            label: {
				                //数据百分比显示在饼图里面
				                position: 'inner',
				                formatter: function (params) {
				                    return (params.percent - 0).toFixed(0) + '%'
				                }
				            },
				            labelLine: {
				                //饼图指线
				                show: false
				            }
				        },
				        emphasis: {
				            //鼠标悬浮时饼图上数据显示
				            label: {
				                show: true,
				                formatter: "{b}\n{d}%"
				            }
				        }

				    },
				    data: [
						{ value: 15, name: 'IT' },
						{ value: 29, name: 'IB' },
						{ value: 38, name: 'DC' },
						{ value: 19, name: 'SS' }
					]
				}
			]
	    };

	    // 为echarts对象加载数据 
	    myChart.setOption(option);
	});

}

//规模类型饼图
function scaleDonePie() {
    require(
    [
    'echarts',
    'echarts/chart/pie'
    ],
	function (ec) {
	    var myChart = ec.init(document.getElementById('busScale'));
	    // 自定义扩展图表类型：mapType = USA
	    var option = {
	        color: [
				'#5cb85c',
				'#5bc0de',
				'#f0ad4e',
				'#e75b8d'
			],
	        title: {
	            text: '规模类型',
	            x: 'center'
	        },
	        tooltip: {
	            show: true,
	            formatter: "{a} <br/>{b} : {c} ({d}%)"
	        },
	        legend: {
	            orient: 'vertical',
	            x: 'left',
	            data: ['特大', '大', '中', '小']
	        },
	        //是否拖拽
	        //calculable : true,
	        series: [
				{
				    name: '规模类型占比',
				    type: 'pie',
				    selectedMode: 'single',
				    //设置饼图的位置
				    center: ['55%', 170],
				    //设置饼图大小
				    radius: 130,
				    itemStyle: {
				        normal: {
				            label: {
				                //数据百分比显示在饼图里面
				                position: 'inner',
				                formatter: function (params) {
				                    return (params.percent - 0).toFixed(0) + '%'
				                }
				            },
				            labelLine: {
				                //饼图指线
				                show: false
				            }
				        },
				        emphasis: {
				            //鼠标悬浮时饼图上数据显示
				            label: {
				                show: true,
				                formatter: "{b}\n{d}%"
				            }
				        }

				    },
				    data: [
						{ value: 35, name: '特大' },
						{ value: 29, name: '大' },
						{ value: 8, name: '中' },
						{ value: 49, name: '小' }
					]
				}
			]
	    };

	    // 为echarts对象加载数据 
	    myChart.setOption(option);
	});

}


//趋势行业类型饼图
function industryTrendPie() {
    require(
    [
    'echarts',
    'echarts/chart/pie'
    ],
	function (ec) {
	    var myChart = ec.init(document.getElementById('busTrendIndustry'));
	    // 自定义扩展图表类型：mapType = USA
	    var option = {
	        color: [
				'#5cb85c',
				'#5bc0de',
				'#f0ad4e',
				'#e75b8d',
				'#d9534f'
			],
	        title: {
	            text: '行业类型',
	            x: 'center'
	        },
	        tooltip: {
	            show: true,
	            formatter: "{a} <br/>{b} : {c} ({d}%)"
	        },
	        legend: {
	            orient: 'vertical',
	            x: 'left',
	            data: ['政府', '金融', '交通', '教育', '其他']
	        },
	        //是否拖拽
	        //calculable : true,
	        series: [
				{
				    name: '行业类型占比',
				    type: 'pie',
				    selectedMode: 'single',
				    //设置饼图的位置
				    center: ['55%', 170],
				    //设置饼图大小
				    radius: 130,
				    itemStyle: {
				        normal: {
				            label: {
				                //数据百分比显示在饼图里面
				                position: 'inner',
				                formatter: function (params) {
				                    return (params.percent - 0).toFixed(0) + '%'
				                }
				            },
				            labelLine: {
				                //饼图指线
				                show: false
				            }
				        },
				        emphasis: {
				            //鼠标悬浮时饼图上数据显示
				            label: {
				                show: true,
				                formatter: "{b}\n{d}%"
				            }
				        }

				    },
				    data: [
						{ value: 35, name: '政府' },
						{ value: 29, name: '金融' },
						{ value: 48, name: '交通' },
						{ value: 19, name: '教育' },
						{ value: 5, name: '其他' }
					]
				}
			]
	    };

	    // 为echarts对象加载数据 
	    myChart.setOption(option);
	});

}

//趋势项目类型饼图
function projectTrendPie() {
    require(
    [
    'echarts',
    'echarts/chart/pie'
    ],
	function (ec) {
	    var myChart = ec.init(document.getElementById('busTrendProject'));
	    // 自定义扩展图表类型：mapType = USA
	    var option = {
	        color: [
				'#5cb85c',
				'#5bc0de',
				'#f0ad4e',
				'#e75b8d'
			],
	        title: {
	            text: '项目类型',
	            x: 'center'
	        },
	        tooltip: {
	            show: true,
	            formatter: "{a} <br/>{b} : {c} ({d}%)"
	        },
	        legend: {
	            orient: 'vertical',
	            x: 'left',
	            data: ['IT', 'IB', 'DC', 'SS']
	        },
	        //是否拖拽
	        //calculable : true,
	        series: [
				{
				    name: '项目类型占比',
				    type: 'pie',
				    selectedMode: 'single',
				    //设置饼图的位置
				    center: ['55%', 170],
				    //设置饼图大小
				    radius: 130,
				    itemStyle: {
				        normal: {
				            label: {
				                //数据百分比显示在饼图里面
				                position: 'inner',
				                formatter: function (params) {
				                    return (params.percent - 0).toFixed(0) + '%'
				                }
				            },
				            labelLine: {
				                //饼图指线
				                show: false
				            }
				        },
				        emphasis: {
				            //鼠标悬浮时饼图上数据显示
				            label: {
				                show: true,
				                formatter: "{b}\n{d}%"
				            }
				        }

				    },
				    data: [
						{ value: 15, name: 'IT' },
						{ value: 29, name: 'IB' },
						{ value: 38, name: 'DC' },
						{ value: 49, name: 'SS' }
					]
				}
			]
	    };

	    // 为echarts对象加载数据 
	    myChart.setOption(option);
	});

}

//趋势规模类型饼图
function scaleTrendPie() {
    require(
    [
    'echarts',
    'echarts/chart/pie'
    ],
	function (ec) {
	    var myChart = ec.init(document.getElementById('busTrendScale'));
	    // 自定义扩展图表类型：mapType = USA
	    var option = {
	        color: [
				'#5cb85c',
				'#5bc0de',
				'#f0ad4e',
				'#e75b8d'
			],
	        title: {
	            text: '规模类型',
	            x: 'center'
	        },
	        tooltip: {
	            show: true,
	            formatter: "{a} <br/>{b} : {c} ({d}%)"
	        },
	        legend: {
	            orient: 'vertical',
	            x: 'left',
	            data: ['特大', '大', '中', '小']
	        },
	        //是否拖拽
	        //calculable : true,
	        series: [
				{
				    name: '规模类型占比',
				    type: 'pie',
				    selectedMode: 'single',
				    //设置饼图的位置
				    center: ['55%', 170],
				    //设置饼图大小
				    radius: 130,
				    itemStyle: {
				        normal: {
				            label: {
				                //数据百分比显示在饼图里面
				                position: 'inner',
				                formatter: function (params) {
				                    return (params.percent - 0).toFixed(0) + '%'
				                }
				            },
				            labelLine: {
				                //饼图指线
				                show: false
				            }
				        },
				        emphasis: {
				            //鼠标悬浮时饼图上数据显示
				            label: {
				                show: true,
				                formatter: "{b}\n{d}%"
				            }
				        }

				    },
				    data: [
						{ value: 25, name: '特大' },
						{ value: 49, name: '大' },
						{ value: 18, name: '中' },
						{ value: 40, name: '小' }
					]
				}
			]
	    };

	    // 为echarts对象加载数据 
	    myChart.setOption(option);
	});

}

//分类耗费占比饼图
function classifyCostPie() {
    require(
    [
    'echarts',
    'echarts/chart/pie'
    ],
	function (ec) {
	    var myChart = ec.init(document.getElementById('classifyCost'));
	    // 自定义扩展图表类型：mapType = USA
	    var option = {
	        color: [
				'#5cb85c',
				'#5bc0de',
				'#f0ad4e',
				'#e75b8d'
			],
	        title: {
	            text: '规模类型',
	            x: 'center'
	        },
	        tooltip: {
	            show: true,
	            formatter: "{a} <br/>{b} : {c} ({d}%)"
	        },
	        legend: {
	            orient: 'vertical',
	            x: '150px',
	            y: 'center',
	            data: ['渠道', '项目', '管理', '其他']
	        },
	        //是否拖拽
	        //calculable : true,
	        series: [
				{
				    name: '分类耗费占比',
				    type: 'pie',
				    selectedMode: 'single',
				    //设置饼图的位置
				    center: ['50%', 170],
				    //设置饼图大小
				    radius: 130,
				    itemStyle: {
				        normal: {
				            label: {
				                //数据百分比显示在饼图里面
				                position: 'inner',
				                formatter: function (params) {
				                    return (params.percent - 0).toFixed(0) + '%'
				                }
				            },
				            labelLine: {
				                //饼图指线
				                show: false
				            }
				        },
				        emphasis: {
				            //鼠标悬浮时饼图上数据显示
				            label: {
				                show: true,
				                formatter: "{b}\n{d}%"
				            }
				        }

				    },
				    data: [
						{ value: 25, name: '渠道' },
						{ value: 49, name: '项目' },
						{ value: 18, name: '管理' },
						{ value: 40, name: '其他' }
					]
				}
			]
	    };

	    // 为echarts对象加载数据 
	    myChart.setOption(option);
	});
}

//项目耗费占比柱状图
function projectCostBar() {
    require(
    [
    'echarts',
    'echarts/chart/bar'
    ],
	function (ec) {
	    var myChart = ec.init(document.getElementById('projectCost'));
	    // 自定义扩展图表类型：mapType = USA
	    var option = {
	        title: {
	            text: '项目耗费占比'
	        },
	        tooltip: {
	            trigger: 'axis'
	        },
	        calculable: false,
	        legend: {
	            data: ['耗费时间（天）', '所占比率（%）']
	        },
	        xAxis: [
				{
				    type: 'category',
				    data: ['项目一', '项目二', '项目三', '项目四']
				}
			],
	        yAxis: [
				{
				    type: 'value',
				    name: '耗费时间',
				    axisLabel: {
				        formatter: '{value}'
				    }
				},
				{
				    type: 'value',
				    name: '所占比率',
				    axisLabel: {
				        formatter: '{value}'
				    }
				}
			],
	        series: [
				{
				    name: '耗费时间（天）',
				    type: 'bar',
				    data: [54, 90, 50, 30]
				},
				{
				    name: '所占比率（%）',
				    type: 'bar',
				    // 设置y轴右边
				    yAxisIndex: 1,
				    data: [5, 8, 30, 50]
				}
			]
	    };
	    // 为echarts对象加载数据 
	    myChart.setOption(option);
	});
}

//阶段耗费占比饼图
function stageCostPie() {
    require(
    [
    'echarts',
    'echarts/chart/pie'
    ],
	function (ec) {
	    var myChart = ec.init(document.getElementById('stageCost'));
	    // 自定义扩展图表类型：mapType = USA
	    var option = {
	        color: [
				'#5cb85c',
				'#5bc0de',
				'#f0ad4e',
				'#e75b8d'
			],
	        title: {
	            text: '规模类型',
	            x: 'center'
	        },
	        tooltip: {
	            show: true,
	            formatter: "{a} <br/>{b} : {c} ({d}%)"
	        },
	        legend: {
	            orient: 'vertical',
	            x: '150px',
	            y: 'center',
	            data: ['获取信息', '培育公关', '策划运作', '投标竞标', '签约移交']
	        },
	        //是否拖拽
	        //calculable : true,
	        series: [
				{
				    name: '分类耗费占比',
				    type: 'pie',
				    selectedMode: 'single',
				    //设置饼图的位置
				    center: ['50%', 170],
				    //设置饼图大小
				    radius: 130,
				    itemStyle: {
				        normal: {
				            label: {
				                //数据百分比显示在饼图里面
				                position: 'inner',
				                formatter: function (params) {
				                    return (params.percent - 0).toFixed(0) + '%'
				                }
				            },
				            labelLine: {
				                //饼图指线
				                show: false
				            }
				        },
				        emphasis: {
				            //鼠标悬浮时饼图上数据显示
				            label: {
				                show: true,
				                formatter: "{b}\n{d}%"
				            }
				        }

				    },
				    data: [
						{ value: 25, name: '获取信息' },
						{ value: 49, name: '培育公关' },
						{ value: 18, name: '策划运作' },
						{ value: 40, name: '投标竞标' },
						{ value: 30, name: '签约移交' }
					]
				}
			]
	    };

	    // 为echarts对象加载数据 
	    myChart.setOption(option);
	});
}

//考勤月报饼图
function attendancePie() {
    require(
    [
    'echarts',
    'echarts/chart/pie'
    ],
	function (ec) {
	    var myChart = ec.init(document.getElementById('attendancePie'));
	    // 自定义扩展图表类型：mapType = USA
	    var option = {
	        color: [
				'#5cb85c',
				'#5bc0de',
				'#f0ad4e',
				'#e75b8d'
			],
	        title: {
	            text: '规模类型',
	            x: 'center'
	        },
	        tooltip: {
	            show: true,
	            formatter: "{a} <br/>{b} : {c} ({d}%)"
	        },
	        legend: {
	            orient: 'vertical',
	            x: '150px',
	            y: 'center',
	            data: ['请假', '渠道', '项目', '管理']
	        },
	        //是否拖拽
	        //calculable : true,
	        series: [
				{
				    name: '分类耗费占比',
				    type: 'pie',
				    selectedMode: 'single',
				    //设置饼图的位置
				    center: ['50%', 170],
				    //设置饼图大小
				    radius: 110,
				    itemStyle: {
				        normal: {
				            label: {
				                //数据百分比显示在饼图里面
				                position: 'inner',
				                formatter: function (params) {
				                    return (params.percent - 0).toFixed(0) + '%'
				                }
				            },
				            labelLine: {
				                //饼图指线
				                show: false
				            }
				        },
				        emphasis: {
				            //鼠标悬浮时饼图上数据显示
				            label: {
				                show: true,
				                formatter: "{b}\n{d}%"
				            }
				        }

				    },
				    data: [
						{ value: 5, name: '请假' },
						{ value: 49, name: '渠道' },
						{ value: 18, name: '项目' },
						{ value: 40, name: '管理' }
					]
				}
			]
	    };

	    // 为echarts对象加载数据 
	    myChart.setOption(option);
	    //饼图点击
	    var ecConfig = require('echarts/config');
	    myChart.on(ecConfig.EVENT.PIE_SELECTED, function (param) {
	        var selected = param.selected;
	        var str = '';
	        var serie;
	        for (var idx in selected) {
	            serie = option.series[idx];
	            for (var i = 0, l = serie.data.length; i < l; i++) {
	                //循环得到option第一个series中的name
	                name = option.series[0].data[i].name;
	                if (selected[idx][i]) {
	                    str += serie.data[i].name;
	                }
	            }
	        }
	        if (str == "请假") {
	            $(".leaveTr").siblings().hide();
	            $(".leaveTr").show();
	        }
	        else if (str == "渠道") {
	            $(".channelTr").siblings().hide();
	            $(".channelTr").show();
	        }
	        else if (str == "管理") {
	            $(".manageTr").siblings().hide();
	            $(".manageTr").show(); projectTr
	        }
	        else if (str == "项目") {
	            $(".projectTr").siblings().hide();
	            $(".projectTr").show();
	        }

	    });
	});
}