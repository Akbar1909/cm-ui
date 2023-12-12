export function prepareUser(values) {
  return {
    firstName: values.firstName,
    lastName: values.lastName,
    phone: values.phone,
    roleId: Number(values.roleId),
    username: values.username,
    ...(values.projects && { projects: values.projects.map((item) => item.value) }),
    ...(values.password && { password: values.password }),
    ...(values?.id && { id: values.id }),
    ...(values?.project && { projectId: values.project?.value }),
    ...(values?.organization && { organizationId: values.organization?.value })
  };
}
