from rest_framework.request import Request
from rest_framework.response import Response

from sentry import features, integrations
from sentry.api.bases import GroupEndpoint
from sentry.api.paginator import OffsetPaginator
from sentry.api.serializers import serialize
from sentry.api.serializers.models.integration import IntegrationIssueSerializer
from sentry.integrations.base import IntegrationFeatures
from sentry.models import Integration


class GroupIntegrationsEndpoint(GroupEndpoint):
    def get(self, request: Request, group) -> Response:
        has_issue_basic = features.has(
            "organizations:integrations-issue-basic", group.organization, actor=request.user
        )

        has_issue_sync = features.has(
            "organizations:integrations-issue-sync", group.organization, actor=request.user
        )

        if not (has_issue_basic or has_issue_sync):
            return self.respond([])

        providers = [
            i.key
            for i in integrations.all()
            if i.has_feature(IntegrationFeatures.ISSUE_BASIC)
            or i.has_feature(IntegrationFeatures.ISSUE_SYNC)
        ]
        return self.paginate(
            queryset=Integration.objects.filter(
                organizations=group.organization, provider__in=providers
            ),
            request=request,
            order_by="name",
            on_results=lambda x: serialize(x, request.user, IntegrationIssueSerializer(group)),
            paginator_cls=OffsetPaginator,
        )
