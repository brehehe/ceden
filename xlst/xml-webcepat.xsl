<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:n="http://www.google.com/schemas/sitemap-news/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
	<xsl:template match="/">
		<html xmlns="http://www.w3.org/1999/xhtml">
			<head>
				<title>XML News Sitemap</title>
				<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
				<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
				<script type="text/javascript" src="http://tablesorter.com/jquery.tablesorter.min.js"></script>
				<script	type="text/javascript"><![CDATA[
					$(document).ready(function() { 
				        $("#sitemap").tablesorter( { widgets: ['zebra'] } ); 
					});
				]]></script>
				<style type="text/css">
					body {
						font-family: Helvetica, Arial, sans-serif;
						font-size: 13px;
						color: #545353;
					}
					table {
						border: none;
						border-collapse: collapse;
					}
					#sitemap tr.odd {
						background-color: #eee;
					}
					#sitemap tbody tr:hover {
						background-color: #ccc;
					}
					#sitemap tbody tr:hover td, #sitemap tbody tr:hover td a {
						color: #000;
					}
					#content {
						margin: 0 auto;
						width: 1000px;
					}
					p.expl {
						margin: 10px 3px;
						line-height: 1.3em;
					}
					#expl a {
						color: #da3114;
						font-weight: bold;
					}
					a {
						color: #000;
						text-decoration: none;
					}
					a:visited {
						color: #777;
					}
					a:hover {
						text-decoration: underline;
					}
					td {
						font-size:11px;
					}
					th {
						text-align:left;
						padding-right:30px;
						font-size:11px;
					}
					thead th {
						border-bottom: 1px solid #000;
						cursor: pointer;
					}
				</style>
			</head>
			<body>
				<div id="content">
					<h1>XML News Sitemap</h1>
					<p class="expl">
						Generated by WebCepat
					</p>
					<p class="expl">
						You can find more information about XML News sitemaps <a href="http://www.google.com/support/webmasters/bin/answer.py?hl=en&amp;answer=74288">here</a>.
					</p>
					<p class="expl">
						This sitemap contains <xsl:value-of select="count(s:urlset/s:url)"/> URLs.
					</p>			
					<table id="sitemap" cellpadding="3">
						<thead>
							<tr>
								<th width="50%">Title</th>
								<th width="25%">Keyword(s)</th>
								<th width="10%">Genre(s)</th>
								<th width="15%">Publication Date</th>
							</tr>
						</thead>
						<tbody>
							<xsl:for-each select="s:urlset/s:url">
								<tr>
									<td>
										<xsl:variable name="itemURL">
											<xsl:value-of select="s:loc"/>
										</xsl:variable>
										<a href="{$itemURL}">
											<xsl:value-of select="n:news/n:title"/>
										</a>
									</td>
									<td>
										<xsl:value-of select="n:news/n:keywords"/>
									</td>
									<td>
										<xsl:value-of select="n:news/n:genres"/>
									</td>
									<td>
										<xsl:value-of select="concat(substring(n:news/n:publication_date,0,11),concat(' ', substring(n:news/n:publication_date,12,5)))"/>
									</td>
								</tr>
							</xsl:for-each>
						</tbody>
					</table>
				</div>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>