import { members } from "@/data";
import { XMLBuilder } from "fast-xml-parser";

export default eventHandler(async () => {
	const validMembers = members.filter(member => member.feed !== null);
	const opmlData = {
		"?xml": { "@_version": "1.0", "@_encoding": "UTF-8" },
		"opml": {
			"@_version": "2.0",
			"head": {
				title: "异家人成员博客订阅",
				dateCreated: new Date().toISOString(),
				dateModified: new Date().toISOString(),
				ownerName: "AlienFamilyHub",
				ownerId: "https://www.afhub.top",
				docs: "https://opml.org/spec2.opml",
			},
			"body": {
				outline: validMembers.map(member => ({
					"@_text": member.name,
					"@_title": member.name,
					"@_type": "rss",
					"@_xmlUrl": member.feed,
					"@_htmlUrl": member.website,
					"@_description": member.desc,
				})),
			},
		},
	};

	const builder = new XMLBuilder({
		ignoreAttributes: false,
		format: true,
	});
	const xmlContent = builder.build(opmlData);

	return new Response(xmlContent, {
		status: 200,
		headers: {
			"Content-Type": "text/xml; charset=utf-8",
		},
	});
});
