<!--
Copyright 2023-2025, Brendan Andrew Rood
-->

<!--
This file is part of the Rapid-Tree-Note / RTN program.

RTN is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

RTN is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with RTN. It is available at ./License/COPYING. Otherwise, see <https://www.gnu.org/licenses/#AGPL>
-->

<!DOCTYPE html>
<html>
    <head>
        <?php 
            $metadata = file_get_contents("./../Resources/partials/metatags.html");
            $metadata = str_replace("{{pageTitle}}", "Rapid Tree Notetaker", $metadata);
            $metadata = str_replace("{{description}}", "In-depth instructions on all the text-formatting features the RTN has to offer", $metadata);
            $metadata = str_replace("{{siteName}}", "Rapid Tree Notetaker", $metadata);
            $metadata = str_replace("{{siteURL}}", $_SERVER["SERVER_NAME"], $metadata);
            $metadata = str_replace("{{tags}}", "Tree,Notetaking,Rapid Tree Notetaker,RTN,UMD,University of Minnesota Duluth,rtn,Brendan Rood,brendan rood,rood,LARS Lab,lars,university of minnesota,computer science,study,learning,education,UMD Duluth", $metadata);
            $metadata = str_replace("{{icon}}", "./../Resources/RTN-Logo.svg", $metadata);
            echo $metadata;
        ?>
    </head>
    <body>
        <script>
            window.location.replace("./../program.html?enc=URI-B64&cmpr=LZMA2&data=3YCAgIJ-jICAgICAgIDquduPqXb7jRIeXZJa5quXL-_YBULetrv7Fa9zmEMC2eluivt2vlCNZPiuXsbhkv_GjRA-b-HKc2DxUmBI4U5mH-sgkkrVSDLm2sbiGLCKZ1npMhvi7MoVVP9nZ5FGbmAw65D3aTQiA1gxofLLmGoVYs5WohUUrc8JknZQ6GsEYIST0CYspt_flZYi_sLWMVZCN0SZSwAfjIbWorOqB-QW05HfuubNlhmH82QDGLWKiWkgV3rToBJsg5HYo3-r0_v8e1QDlDz3imUAck5mzoG0RhBrXHqE92loavL0hX0XxSd6Bs1Nty5oOEf-TXE0Uu1nL-Dvn2BJ1_opeElPQZ4jASNYSxQkpCjByHpzjEyp8RBOlOsfNLKmaf10oIV-1qnN2YFMPuoQjLKVQVY9vW4SqqotAMvIP8bPfGSCe6X8tufidslIzTQYo-cg4bebw2Yrp7eldOaNpdVjproufTjApo-m2wyFH3elDkHfirbkHB-0ZtKUa-m4esdIn-xwN-ik-O9Ix8qvT1W91ysiIDS6FIiieb4SC8KL1PUsl27c6wLR1Q2dbL6tSsV36zFfdzPnyzQOkbtOBhlg2lZx7WEW9EM-Rf7fa_morYQKT3t5lU7sleg_NK_56lcz3UHhjMl-LDD5Zq3z3fXgAW53Wc0NTbWXYgd0pNlEAX0Ztp7UD6mN3a829d9XOq1wgvBDP1PLlZ12-2fowjie5TNsZwSoZt1kGsLwPJYFWsnTra8zY8xLh2pGz2lsQU1Wr2JEcWoZEC3jNZqYujJpnpRTLJp6Jcxsyzb65BiqMPWtpWj99I4Q9FYICq2_TUAUaJ59bpFY8ubOlfI-AQNG2Yx7y-W49_v1WufViDYPPGtZGLyP22ROPSSD7vUWuda8YxHfwvXdwT71NaZ_KbfyRPRpLTxEn_sTTedBcffCmphdCTQjv7AzFKfhM-6FRvoxiGZL9JL1neMQMUlmp8TFQ6M3FFZIKvbSLtluILh2uzqv5cllMPlWbi_NplCcs6p4i5mrqckC4I38bS-dJUgS-evW-R0_OeBEgPPy0gtMKQTjxanYnx2w4yupQ-RkmzpsXBvQPg4TlO0nhXsuV0Wn5JW8sTkBrIoWk1XEC_H5NbMupNtg7EyLri2C2hjv98i3NLrwJU04eT1b0NzCt-pX1Lh0VvLc3Dud1KvRg_UyZEJUJE38KGnNVGJ4KGLV58nwHONSJrHChQXm3jVKjGeuBifUsWLl7ZZqAL3XWlr7T6IRBea-AeeMjOkQqw7uH5hl8hjq8IHvWKt5cVAXZNWXGqEwMKh6L_FeXkOQ3lVQEf87MYVWW8wAnJSo4NXsAdtEZm-fsE0xzXEoC1AJItGt8gzcXcsa5Ptxm5cHARZEgtXQy3RT5bWQ7-l_8D2egA");
        </script>    
    </body>
</html>