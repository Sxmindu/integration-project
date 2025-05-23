<%--
  ~ Copyright (c) 2017-2023, WSO2 LLC (https://www.wso2.com).
  ~
  ~ WSO2 LLC licenses this file to you under the Apache License,
  ~ Version 2.0 (the "License"); you may not use this file except
  ~ in compliance with the License.
  ~ You may obtain a copy of the License at
  ~
  ~    http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing,
  ~ software distributed under the License is distributed on an
  ~ "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  ~ KIND, either express or implied.  See the License for the
  ~ specific language governing permissions and limitations
  ~ under the License.
--%>

<%@page import="org.apache.commons.logging.LogFactory"%>
<%@page import="org.apache.commons.logging.Log"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page import="java.util.Map"%>
<%@ page import="org.wso2.carbon.apimgt.ui.devportal.Util" %>

<%@ page trimDirectiveWhitespaces="true" %>

<!DOCTYPE html>
<html lang="en">
    <%
        Log log = LogFactory.getLog(this.getClass());
        Map settings = Util.readJsonFile("/site/public/theme/settings.json", request.getServletContext());
        String context = Util.getTenantBaseStoreContext(request, (String) Util.readJsonObj(settings, "app.context"));
    %>
    <head>
        <base href="<%= context%>/" />
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
        <title>[DevPortal]WSO2 APIM</title>

        <link rel="shortcut icon" href="<%= context%>/site/public/images/favicon.ico">
        <link rel="icon" type="image/x-icon" href="<%= context%>/site/public/images/_favicon.ico">
        <link href="<%= context%>/site/public/css/main.css" type="text/css" rel="stylesheet" />
    </head>
    <body dir="ltr">
        <div id="react-root">
            <div class="apim-dual-ring"></div>
        </div>
        <script type="text/javascript" src="<%= context%>/site/public/theme/userTheme.js"></script>
        <script type="text/javascript" src="<%= context%>/services/settings/settings.js"></script>
        <script type="text/javascript">
            if (typeof module !== 'undefined') {
                module.exports = Settings; // For Jest unit tests
            }
        </script>
        <script type="text/javascript">
            Settings.app.customUrl.tenantDomain = '<%=Util.getCustomUrlEnabledDomain(request)%>';
        </script>
        <script src="<%= context%>/site/public/fonts/iconfont/MaterialIcons.js"></script>
        <script src="<%= context%>/site/public/dist/index.9a2ce8733ef18848cae3.bundle.js"></script>
        <link rel="stylesheet" href="<%= context%>/site/public/fonts/iconfont/material-icons.css">
        <link rel="stylesheet" href="<%= context%>/site/public/css/overrides.css">
    </body>
</html>
